import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useParams} from 'react-router-dom';
import {whiskyStore} from '../store';
import {Whisky as WhiskyModel} from '../model';
import {filterHighlightablePart} from '../helper';

interface WhiskyParams {
  name: string;
}

export const Whisky = observer(() => {
  const {name} = useParams<WhiskyParams>();
  const [whisky, setWhisky] = useState<WhiskyModel | undefined>(undefined);

  const findCurrentWhisky = async () => {
    const correctName = whiskyStore.index[name];

    if (!whiskyStore.allWhiskies.length) {
      await whiskyStore.loadAllWhiskies();
    }

    const currentWhisky = whiskyStore.allWhiskies.find(
      matcherWhisky => matcherWhisky.name === correctName
    );
    setWhisky(currentWhisky);
  };

  useEffect(() => {
    if (!whiskyStore.indexLoaded) {
      whiskyStore.loadIndexes();
    } else {
      findCurrentWhisky();
    }
  }, [whiskyStore.indexLoaded]);

  return (
    <div className="Whisky">
      {!whisky ? (
        <span>Loading...</span>
      ) : (
        <div className="wrapper">
          <p className="name">{filterHighlightablePart(whisky.name)}</p>
          <p className="description">{whisky.description}</p>
        </div>
      )}
    </div>
  );
});
