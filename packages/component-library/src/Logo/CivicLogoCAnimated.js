import React from "react";
import PropTypes from "prop-types";
import { css } from "emotion";
import isClient from "../utils/isClient";
import logoC from "../../assets/civic-logo-c.svg";

const stylesClass = css`
  height: 100px;
  width: auto;
  animation-duration: 3s, 1s;
  animation-name: rotate, fadeInOut;
  animation-iteration-count: infinite, 1;
  opacity: 0.4;
`;

const CivicLogoCAnimated = ({ alt }) =>
  isClient && <img className={stylesClass} src={logoC} alt={alt} />;

CivicLogoCAnimated.displayName = "Logo";
CivicLogoCAnimated.propTypes = {
  alt: PropTypes.string
};

export default CivicLogoCAnimated;
