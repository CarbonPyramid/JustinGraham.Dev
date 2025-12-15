import styled from 'styled-components'

export const AppWrapper = styled.main`
  position: relative;
  overflow: hidden;
  height: 500px;
  width: 100%;
  max-width: 900px;
  background-color: var(--color-appbg);
  border-radius: 5px;

  @media (max-width: 600px) {
    height: 450px;
    transform: scale(0.95);
    transform-origin: top center;
  }

  @media (max-width: 480px) {
    height: 420px;
    transform: scale(0.85);
  }
`

export const GameInstruction = styled.p`
  position: absolute;
  top: 16px;
  left: 16px;
  margin: 0;
  font-size: 14px;

  @media (max-width: 600px) {
    font-size: 12px;
    top: 10px;
    left: 10px;
  }
`

export const Gallow = styled.div`
  position: relative;
  width: 150px;
  height: 15px;
  background-color: var(--color-darkgrey);
  top: 50px;
  border-radius: 0 5px 5px 0;

  @media (max-width: 600px) {
    width: 100px;
    top: 40px;
  }
`

export const DownPipe = styled.div`
  position: absolute;
  left: 120px;
  width: 15px;
  height: 40px;
  background-color: var(--color-darkgrey);
  border-radius: 5px;

  @media (max-width: 600px) {
    left: 80px;
    width: 12px;
    height: 30px;
  }
`

export const RightBlueTriangle = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  right: 0;
  bottom: 0;
  border-style: solid;
  border-width: 0 0 250px 250px;
  border-color: transparent transparent var(--color-purpleish) transparent;

  @media (max-width: 600px) {
    border-width: 0 0 150px 150px;
  }
`
export const Input = styled.input`
  position: absolute;
  opacity: 0;
`
