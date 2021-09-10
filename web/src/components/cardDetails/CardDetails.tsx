import { DefaultButton } from '@fluentui/react';
import React from 'react';
import { useApp } from '../../AppContext';
import { ICard } from '../../controllers/Card';
import { useHome } from '../../HomeContext';

export interface ICardDetailsProps {
  card: ICard;
  editing: boolean;
}

export const CardDetails: React.VoidFunctionComponent<ICardDetailsProps> = () => {
  const { showCardDetail } = useApp();
  const { expandCardDetail } = useHome();

  return (
    <>
      <h1>showing some detail</h1>

      <DefaultButton onClick={() => showCardDetail(null)}>
        close detail
      </DefaultButton>

      <DefaultButton onClick={() => expandCardDetail(false)}>
        collapse
      </DefaultButton>

      <DefaultButton onClick={() => expandCardDetail(true)}>
        expand
      </DefaultButton>
    </>
  );
};
