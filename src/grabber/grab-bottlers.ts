import {JSDOM} from 'jsdom';
import {axios} from '../axios';
import {BOTTLERS} from '../constants';
import {prependBaseURL, stripFormatting} from '../helper';
import {Bottler} from '../model';

const parseBottlers = (html: string) => {
  const dom = new JSDOM(html);
  const linkElements = dom.window.document.querySelectorAll(
    'table[width="190"][bordercolor="#333333"][bgcolor="#000000"] > tbody > tr.textenormalgras > td > div[align="center"] > font > a'
  );

  const bottlers: Bottler[] = [];

  linkElements.forEach(linkElement => {
    const url = prependBaseURL(linkElement.getAttribute('href'));
    const name = stripFormatting(linkElement.textContent);

    if (!name || !url) {
      return;
    }

    bottlers.push({
      name,
      url,
    });
  });

  localStorage.setItem(BOTTLERS, JSON.stringify(bottlers));
  return bottlers;
};

const grabBottlers = async () => {
  try {
    const response = await axios({method: 'GET'});
    return parseBottlers(response.data);
  } catch (e) {
    console.info('failed to retrieve bottlers');
    console.error(e);
    return [];
  }
};

export const loadBottlers = async () => {
  const bottlers = localStorage.getItem(BOTTLERS);

  return typeof bottlers === 'string'
    ? (JSON.parse(bottlers) as Bottler[])
    : await grabBottlers();
};
