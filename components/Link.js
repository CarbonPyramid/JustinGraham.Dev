/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import NextLink from "next/link";
import MuiLink from "@mui/material/Link";

// A styled version of the Next.js Link component
function Link(props) {
  const {
    href,
    activeClassName = "active",
    className: classNameProps,
    naked,
    children,
    ...other
  } = props;

  const router = useRouter();
  const pathname = typeof href === "string" ? href : href.pathname;
  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName,
  });

  if (naked) {
    return (
      <NextLink href={href} className={className} {...other}>
        {children}
      </NextLink>
    );
  }

  return (
    <MuiLink
      component={NextLink}
      href={href}
      className={className}
      {...other}
      sx={{ textDecoration: "none" }}
    >
      {children}
    </MuiLink>
  );
}

export default Link;
