/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
}

interface HighScore {
  game: string;
  score: number;
  holder_name: string;
}

// GET /api/highscores?game=hangman
// POST /api/highscores { game: "hangman", score: 10, name: "Player" }

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (request.method === 'GET') {
      // Get high score for a specific game or all games
      const url = new URL(request.url);
      const game = url.searchParams.get('game');

      if (game) {
        // Get single game high score
        const result = await env.DB.prepare(
          'SELECT game, score, holder_name FROM high_scores WHERE game = ?'
        ).bind(game).first<HighScore>();

        if (!result) {
          return new Response(
            JSON.stringify({ game, score: 0, holder_name: '' }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          );
        }

        return new Response(
          JSON.stringify(result),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      } else {
        // Get all high scores
        const results = await env.DB.prepare(
          'SELECT game, score, holder_name FROM high_scores'
        ).all<HighScore>();

        return new Response(
          JSON.stringify(results.results),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      }
    }

    if (request.method === 'POST') {
      const body = await request.json() as { game: string; score: number; name: string };
      const { game, score, name } = body;

      // Validate input
      if (!game || typeof score !== 'number' || !name) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: game, score, name' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        );
      }

      // Validate game name
      const validGames = ['hangman', 'snake', 'tetris'];
      if (!validGames.includes(game)) {
        return new Response(
          JSON.stringify({ error: 'Invalid game name' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        );
      }

      // Sanitize name (max 20 chars, alphanumeric + spaces only)
      const sanitizedName = name.slice(0, 20).replace(/[^a-zA-Z0-9 ]/g, '').trim();

      if (!sanitizedName) {
        return new Response(
          JSON.stringify({ error: 'Invalid name' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        );
      }

      // Get current high score
      const current = await env.DB.prepare(
        'SELECT score FROM high_scores WHERE game = ?'
      ).bind(game).first<{ score: number }>();

      // Only update if new score is higher
      if (!current || score > current.score) {
        await env.DB.prepare(
          `INSERT INTO high_scores (game, score, holder_name, updated_at)
           VALUES (?, ?, ?, datetime('now'))
           ON CONFLICT(game) DO UPDATE SET
             score = excluded.score,
             holder_name = excluded.holder_name,
             updated_at = excluded.updated_at`
        ).bind(game, score, sanitizedName).run();

        return new Response(
          JSON.stringify({ success: true, game, score, holder_name: sanitizedName, isNewRecord: true }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      }

      return new Response(
        JSON.stringify({ success: false, message: 'Score not high enough', currentHighScore: current.score }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      }
    );

  } catch (error) {
    console.error('High scores API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
};
