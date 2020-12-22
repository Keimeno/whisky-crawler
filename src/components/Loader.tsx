import React from 'react';
import {loadBottlers, loadWhiskyPages} from '../grabber';
import {WhiskyPage} from '../model';

export interface LoaderProps {
  onLoad: (hasLoaded: boolean) => void;
}

export const Loader = (props: LoaderProps) => {
  const initialize = async () => {
    // load bottlers
    const bottlers = await loadBottlers();

    // load whisky pages
    const whiskyPages: WhiskyPage[] = [];

    for (const bottler of bottlers) {
      whiskyPages.push(...(await loadWhiskyPages(bottler)));
    }
  };

  initialize();

  return (
    <>
      <p>Loading...</p>
    </>
  );
};
