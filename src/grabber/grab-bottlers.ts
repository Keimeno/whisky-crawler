import {axios} from '../axios';
import {BOTTLERS} from '../constants';
import {database} from '../database';
import {retrieveCorrectBaseURL, stripFormatting} from '../helper';
import {Bottler} from '../model';

const parseBottlers = async (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const linkElements = doc.querySelectorAll(
    'table[width="190"][bordercolor="#333333"][bgcolor="#000000"] > tbody > tr.textenormalgras > td > div[align="center"] > font > a'
  );

  const bottlers: Bottler[] = [];

  linkElements.forEach(linkElement => {
    const url = retrieveCorrectBaseURL(linkElement.getAttribute('href'));
    const name = stripFormatting(linkElement.textContent);

    if (!name || !url) {
      return;
    }

    bottlers.push({
      name,
      url,
    });
  });

  await database.setItem(BOTTLERS, bottlers);

  return bottlers;
};

const grabBottlers = async () => {
  try {
    const response = await axios({method: 'GET'});
    return await parseBottlers(response.data);
  } catch (e) {
    console.info('failed to retrieve bottlers');
    console.error(e);
    return [];
  }
};

export const loadBottlers = async () => {
  const bottlers = await database.getItem<Bottler[]>(BOTTLERS);
  return bottlers ? bottlers : await grabBottlers();
};
