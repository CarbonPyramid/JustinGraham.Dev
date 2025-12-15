import styled from 'styled-components'

export const Wrapper = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  width: 500px;

  @media (max-width: 600px) {
    width: 60%;
    top: 30px;
  }
`
export const Title = styled.h1`
  text-transform: uppercase;
  color: var(--color-darkgrey);

  @media (max-width: 600px) {
    font-size: 16px;
    margin: 0 0 5px 0;
  }
`
export const List = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;

  @media (max-width: 600px) {
    height: auto;
  }
`
export const ListItem = styled.div`
  text-align: center;
  color: var(--color-blue);
  font-size: var(--font-size-large);
  height: 70px;
  margin: 10px;
  text-transform: uppercase;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  @media (max-width: 600px) {
    font-size: 20px;
    height: 30px;
    margin: 3px;
  }
`
