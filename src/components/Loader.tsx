import React, {useEffect} from 'react';
import {loadArchives} from '../grabber/grab-whisky';

export interface LoaderProps {
  onLoad: (hasLoaded: boolean) => void;
}

export const Loader = (props: LoaderProps) => {
  const initialize = async () => {
    await loadArchives();
    props.onLoad(true);
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <div className="Loader">
      <p></p>
      <h2>Loading...</h2>
      <p>This might take a while, do not close the app during this time.</p>
    </div>
  );
};
