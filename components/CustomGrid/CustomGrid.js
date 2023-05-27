import styled from 'styled-components/native';
import React from 'react';
import { COLORS } from '../../constants/colors';

export const Row = styled.View`
  flex-direction: row;
  align-items: ${(props) => (props.align ? props.align : 'center')};
  background-color: ${(props) =>
    props.bgColor ? props.bgColor : COLORS.white};
  width: ${(props) => props.width || '100%'};
  justify-content: ${(props) =>
    props.justify ? props.justify : 'space-between'};
  padding-bottom: ${(props) =>
    props.paddingBottom ? props.paddingBottom : 0}px;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)}px;
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 0)}px;
  border-top-width: ${(props) => (props.borderTop ? props.borderTop : 1)}px;
  border-top-color: ${(props) =>
    props?.showBorderTop
      ? props.borderTopColor || COLORS.lineBorder
      : 'transparent'};
  border-bottom-width: 1px;
  border-bottom-color: ${(props) =>
    props?.showBorder
      ? props.border_bottom || COLORS.lineBorder
      : 'transparent'};
`;

export const PressableRow = styled.Pressable`
  flex-direction: row;
  align-items: ${(props) => (props.align ? props.align : 'center')};
  background-color: ${(props) =>
    props.bgColor ? props.bgColor : COLORS.white};
  width: ${(props) => props.width || '100%'};
  justify-content: ${(props) =>
    props.justify ? props.justify : 'space-between'};
  padding-bottom: ${(props) =>
    props.paddingBottom ? props.paddingBottom : 0}px;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)}px;
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 0)}px;
  border-bottom-width: ${(props) =>
    props.bottomWidth ? props.bottomWidth : 1}px;
  border-bottom-color: ${(props) =>
    props?.showBorder
      ? props.border_bottom || COLORS.lineBorder
      : 'transparent'};
  ${(props) => props.style};
`;

export const SpacedRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Col = styled.View`
  background-color: ${(props) =>
    props.bgColor ? props.bgColor : COLORS.white};
  width: ${(props) => props.width || '100%'};
  justify-content: ${(props) =>
    props.justify ? props.justify : 'space-between'};
  align-items: ${(props) => (props.align ? props.align : 'flex-start')};
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)}px;
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 0)}px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) =>
    props?.showBorder
      ? props.border_bottom || COLORS.lineBorder
      : 'transparent'};
  ${(props) => props.style};
`;
export const PressableCol = styled.Pressable`
  background-color: ${(props) =>
    props.bgColor ? props.bgColor : COLORS.white};
  width: ${(props) => props.width || '100%'};
  justify-content: ${(props) =>
    props.justify ? props.justify : 'space-between'};
  align-items: ${(props) => (props.align ? props.align : 'flex-start')};
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)}px;
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 0)}px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) =>
    props?.showBorder
      ? props.border_bottom || COLORS.lineBorder
      : 'transparent'};
  ${(props) => props.style};
`;

export const SpacedCol = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: space-between;
`;

export const Center = styled.View`
  justify-content: center;
  align-items: center;
`;
