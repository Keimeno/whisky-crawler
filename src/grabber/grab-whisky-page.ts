import {axios} from '../axios';
import {WHISKY_PAGES} from '../constants';
import {database} from '../database';
import {cleanURL, retrieveCorrectBaseURL, stripFormatting} from '../helper';
import {Bottler, WhiskyPage} from '../model';

const parseWhiskyPages = async (html: string, bottler: Bottler) => {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const whiskyPageElements = doc.querySelectorAll(
      'table[width="540"][border="0"][align="center"][cellpadding="0"][cellspacing="0"] table[width="650"][border="0"][cellspacing="0"] tr[valign="top"] ul > li'
    );

    const whiskyPages: WhiskyPage[] = [];

    whiskyPageElements.forEach(whiskyPageElement => {
      const mainElement = whiskyPageElement.querySelector('font');
      whiskyPageElement = mainElement ? mainElement : whiskyPageElement;

      if (!whiskyPageElement) {
        return;
      }

      const uncutName = stripFormatting(whiskyPageElement.textContent);
      const linkElement = whiskyPageElement.querySelector('a')!;

      if (!linkElement) {
        return;
      }

      const internalWhiskyID = linkElement.textContent;
      const url = retrieveCorrectBaseURL(
        cleanURL(linkElement.getAttribute('href'))
      );
      const name = uncutName.replace(` - ${internalWhiskyID}`, '');

      whiskyPages.push({name, bottler: bottler.name, url});
    });

    await database.setItem(WHISKY_PAGES + bottler.name, whiskyPages);

    return whiskyPages;
  } catch (e) {
    console.error('loading/parsing whisky page failed');
    console.error(e);
    return [];
  }
};

const grabWhiskyPages = async (bottler: Bottler) => {
  try {
    const response = await axios.get(bottler.url);
    return await parseWhiskyPages(response.data, bottler);
  } catch (e) {
    console.info('failed to retrieve whisky pages');
    console.error(e);
    return [];
  }
};

export const loadWhiskyPages = async (bottler: Bottler) => {
  const whiskyPages = await database.getItem<WhiskyPage[]>(
    WHISKY_PAGES + bottler.name
  );

  return whiskyPages ? whiskyPages : await grabWhiskyPages(bottler);
};
