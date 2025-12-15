import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  z-index: 3;
  position: absolute;
  bottom: 40px;
  width: calc(100% - 50px);
  height: 70px;
  margin: 0 auto;
  text-align: center;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;

  @media (max-width: 600px) {
    bottom: 30px;
    height: auto;
    width: calc(100% - 20px);
    gap: 3px;
  }
`

export const Item = styled.div`
  background-color: var(--color-darkgrey);
  width: 65px;
  height: 70px;
  border-radius: 5px;
  text-align: center;
  line-height: 70px;
  text-transform: uppercase;
  font-size: var(--font-size-large);
  color: var(--color-white);

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: var(--color-lightgrey);
    `};

  @media (max-width: 600px) {
    width: 40px;
    height: 45px;
    line-height: 45px;
    font-size: 24px;
  }

  @media (max-width: 400px) {
    width: 32px;
    height: 38px;
    line-height: 38px;
    font-size: 20px;
  }
`
