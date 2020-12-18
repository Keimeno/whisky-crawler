import {JSDOM} from 'jsdom';
import {axios} from '../axios';
import {WHISKY_PAGES} from '../constants';
import {cleanURL, stripFormatting} from '../helper';
import {Bottler, WhiskyPage} from '../model';

const parseWhiskyPages = (html: string, bottler: Bottler): WhiskyPage[] => {
  try {
    const dom = new JSDOM(html);
    const whiskyPageElements = dom.window.document.querySelectorAll(
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
      const url = cleanURL(linkElement.getAttribute('href'));
      const name = uncutName.replace(` - ${internalWhiskyID}`, '');

      whiskyPages.push({name, bottler: bottler.name, url});
    });

    localStorage.setItem(
      WHISKY_PAGES + bottler.name,
      JSON.stringify(whiskyPages)
    );

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
    return parseWhiskyPages(response.data, bottler);
  } catch (e) {
    console.info('failed to retrieve whisky pages');
    console.error(e);
    return [];
  }
};

export const loadWhiskyPages = async (bottler: Bottler) => {
  const whiskyPages = localStorage.getItem(WHISKY_PAGES + bottler.name);

  return typeof whiskyPages === 'string'
    ? (JSON.parse(whiskyPages) as WhiskyPage[])
    : await grabWhiskyPages(bottler);
};
