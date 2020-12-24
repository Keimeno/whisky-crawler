import React from 'react';

export const filterHighlightablePart = (name: string) => {
  if (!/^.*\(.*\)$/.test(name)) {
    return name;
  }

  const {actualName, sidenote} = name.match(
    /^(?<actualName>.*)(?<sidenote>\(.*\).*)$/
  )!.groups!;

  return (
    <>
      <span className="highlight">{actualName}</span>
      <span>{sidenote}</span>
    </>
  );
};
