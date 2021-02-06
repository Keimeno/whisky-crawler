import {
  ENTRY_URL,
  FALSE_BASE_URL,
  LATEST_STORED_ARCHIVE_URL,
  PWSSchemaBreakpoint,
  WHISKIES,
  WHISKY_INDEX,
} from '../constants';
import {database} from '../database';
import moment, {Moment} from 'moment';
import {axios} from '../axios';
import {cleanURL, stripFormatting} from '../helper';
import {WhiskyIndex} from '../model';
import {StoredWhisky, Whisky} from '../model/whisky';
import {cloneDeep} from 'lodash';

const SCHEMA_1_CLASS = 'Textenormal';
const SCHEMA_2_CLASS = 'TextenormalNEW';
const SCHEMA_1_TITLE_CLASS = 'textenormalfoncegras';
const SCHEMA_2_TITLE_CLASS = 'textegrandfoncegras';
const SCHEMA_2_ALTERNATE_DESCRIPTION_CLASS = 'Textenormalfoncé';

let correctCount = 0;
let totalCount = 0;

const titleBlacklist = [
  'last minute bonus',
  'hard times ahead',
  'technical',
  'update:',
  'A wee tribute t',
  '(Don’t try this ',
  '(and a token of ',
  '14,999th review',
  '15,000th review',
  'Prima & Ultima',
  'èire',
];

const extractText = (element: Element | null) => {
  if (element === null) {
    return null;
  }

  if (element.textContent === null || element.textContent === undefined) {
    return null;
  }

  return stripFormatting(element.textContent);
};

export const convertToBase64 = (input: string) =>
  btoa(unescape(encodeURIComponent(input)));

const selectorWithText = (element: Element, ...classes: string[]) =>
  classes
    .map(clazz => element.getElementsByClassName(clazz)[0])
    .find(selected => {
      if (selected === undefined) {
        return false;
      }

      if (selected.textContent === '') {
        return false;
      }

      return true;
    }) || null;

const storeWhisky = async (title: string, description: string) => {
  // getting and storing data from database.
  // not very efficient.
  // TODO: create memory cache
  const index = (await database.getItem<WhiskyIndex>(WHISKY_INDEX)) || {};
  index[convertToBase64(title)] = title;
  await database.setItem(WHISKY_INDEX, index);

  const whiskies = (await database.getItem<StoredWhisky>(WHISKIES)) || {};
  whiskies[convertToBase64(title)] = {name: title, description};
  await database.setItem(WHISKIES, whiskies);
};

const grabTitle = (element: Element) => {
  const titleElement = selectorWithText(
    element,
    SCHEMA_2_TITLE_CLASS,
    SCHEMA_1_TITLE_CLASS
  );

  const title = extractText(titleElement);

  const isBlacklisted = titleBlacklist.some(blacklisted =>
    title?.toLowerCase().includes(blacklisted)
  );

  if (isBlacklisted) {
    // console.log(title + ' is blacklisted');
  }

  return isBlacklisted ? null : title;
};

const grabSchema1Title = (element: Element) => {
  const titleElement = selectorWithText(element, SCHEMA_1_TITLE_CLASS);

  const title = extractText(titleElement);

  const isBlacklisted = titleBlacklist.some(blacklisted =>
    title?.toLowerCase().includes(blacklisted)
  );

  if (isBlacklisted) {
    // console.log(title + ' is blacklisted');
  }

  return isBlacklisted ? null : title;
};

/**
 * Alternate procedure;
 * first child will have class SCHEMA_2_TITLE_CLASS (title)
 * the text content of the current element (desc)
 * after that, wherever the string "points" occurs, will be the given points
 */
const schemaAlternateProcedure = (itemElement: Element) => {
  // console.log('matches alternate procedure');
  const title = grabTitle(itemElement);
};
const items: any[] = [];

/**
 * Standard procedure;
 * first child will have class SCHEMA_2_TITLE_CLASS (title)
 * after that one of its child will have the SCHEMA_2_CLASS (desc)
 * after that, wherever the string "points" occurs, will be the given points
 *
 * it may happen that even though the class on the td element is the correct one,
 * the dependencies might not have been fulfilled. Error checking will be done by
 * reading out these values.
 */
const schemaStandardProcedure = async (itemElement: Element) => {
  // console.log('matches standard procedure');
  const title = grabTitle(itemElement);

  const descriptionElement = selectorWithText(
    itemElement,
    SCHEMA_2_CLASS,
    SCHEMA_1_CLASS,
    SCHEMA_2_ALTERNATE_DESCRIPTION_CLASS
  );

  const description = extractText(descriptionElement);

  if (!title) {
    // console.log('definetely not working, we can skip this one');
    return;
  } else if (!description) {
    // console.log('trying alternate procedure');
    // supplying the title, so we don't have to refetch it.
    return; // schemaAlternateProcedure(itemElement);
  }

  // items.push({
  //   title: title.substring(0, 16),
  //   description: description.substring(0, 24),
  // });
  // correctCount++;
  await storeWhisky(title, description);
  totalCount++;
  return;
};

const schema1AlternateProcedure = async (itemElement: Element) => {
  // console.log('matches standard procedure');
  const title = grabSchema1Title(itemElement);

  const elementWithoutChildren = cloneDeep(itemElement);

  while (elementWithoutChildren.lastElementChild) {
    elementWithoutChildren.removeChild(elementWithoutChildren.lastElementChild);
  }
  console.log(elementWithoutChildren);
  const description = extractText(elementWithoutChildren);

  if (!title) {
    // console.log('definetely not working, we can skip this one');
    return;
  } else if (!description) {
    // console.log('trying alternate procedure');
    // supplying the title, so we don't have to refetch it.
    return; // schemaAlternateProcedure(itemElement);
  }

  await storeWhisky(title, description);
  totalCount++;
  return;
};

const schema1StandardProcedure = async (itemElement: Element) => {
  // console.log('matches standard procedure');
  const title = grabSchema1Title(itemElement);

  const descriptionElement = selectorWithText(itemElement, SCHEMA_1_CLASS);

  const description = extractText(descriptionElement);

  if (!title) {
    // console.log('definetely not working, we can skip this one');
    return;
  } else if (!description) {
    // console.log('trying alternate procedure');
    // supplying the title, so we don't have to refetch it.
    return; // schemaAlternateProcedure(itemElement);
  }

  await storeWhisky(title, description);
  totalCount++;
  return;
};

const grabSchema1Entry = async (doc: Document) => {
  const containerQuery =
    'table[width="540"][border="0"][align="center"][cellpadding="0"][cellspacing="0"] > tbody > tr > td[width="500"][rowspan="2"][valign="top"]';
  const itemContainerQuery =
    'table[width="500"][border="0"] > tbody > tr > td[valign="top"]';

  const itemContainers = doc.querySelectorAll(
    containerQuery + ' ' + itemContainerQuery
  );

  for (const itemContainer of itemContainers) {
    if (!itemContainer.classList.contains(SCHEMA_1_CLASS)) {
      await schema1AlternateProcedure(itemContainer);
    } else {
      await schema1StandardProcedure(itemContainer);
    }
  }
};

const grabSchemaEntry = async (doc: Document) => {
  const containerQuery =
    'table[width="540"][border="0"][align="center"][cellpadding="0"][cellspacing="0"] > tbody > tr > td[width="500"][rowspan="2"][valign="top"]';
  const itemContainerQuery =
    'table[width="500"][border="0"] > tbody > tr > td[valign="top"]';

  const itemContainers = doc.querySelectorAll(
    containerQuery + ' ' + itemContainerQuery
  );

  for (const itemContainer of itemContainers) {
    if (itemContainer.classList.contains(SCHEMA_2_CLASS)) {
      schemaAlternateProcedure(itemContainer);
    } else {
      await schemaStandardProcedure(itemContainer);
    }
  }
};

const grabWhiskies = async (doc: Document, age: Moment) => {
  if (age.unix() - PWSSchemaBreakpoint.Untargeted < 0) {
    return;
  } else if (age.unix() - PWSSchemaBreakpoint.Schema1 < 0) {
    await grabSchema1Entry(doc);
  } else {
    await grabSchemaEntry(doc);
  }
};

const considerEdgeCases = (uri: string, nextURI: string) => {
  // author forgot to change this to the next page.
  // we have to account for such mistakes
  if (uri === 'archivemay06-2.html') {
    return 'archivejuly06-1.html';
  }

  // reached the end. lets set the next uri to empty
  if (FALSE_BASE_URL.includes(nextURI)) {
    return '';
  }

  return false;
};

const findNext = (doc: Document, uri: string) => {
  // works universally in every format. Checks where the next page left
  // arrow is placed. If we move 2 parents up from there and select all a elements,
  // the 2nd a element will always point to the next page
  const element = Array.from(doc.querySelectorAll('strong')).find(el =>
    el.textContent?.includes('<---')
  );

  const linkElements = element?.parentElement?.parentElement?.querySelectorAll(
    'a'
  );

  const next = cleanURL(linkElements?.item(1).getAttribute('href') || '');
  const edgeCase = considerEdgeCases(uri, next);

  return edgeCase === false ? next : edgeCase;
};

const parseAge = (uri: string) => {
  const matcher = /^archive(?<month>\w+)(?<year>\d{2}).*$/i;
  const [, month, year] = uri.match(matcher)!;

  return moment('20' + year + '-' + moment().month(month).format('MM') + '-01');
};

const parseArchive = (html: string, uri: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const next = findNext(doc, uri);
  const age = parseAge(uri);

  return {
    next,
    doc,
    age,
  };
};

const fetchArchive = async (uri: string) => {
  return (await axios.get<string>(uri)).data;
};

export const loadArchives = async () => {
  const latestArchive =
    (await database.getItem<string>(LATEST_STORED_ARCHIVE_URL)) || ENTRY_URL;
  let archive = parseArchive(await fetchArchive(latestArchive), latestArchive);

  // this automatically checks if an update is available.
  while (archive.next) {
    await grabWhiskies(archive.doc, archive.age);
    await database.setItem<string>(LATEST_STORED_ARCHIVE_URL, archive.next);
    console.log(archive.next);
    archive = parseArchive(await fetchArchive(archive.next), archive.next);
  }
  console.log(totalCount);
};
