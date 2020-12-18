import {loadBottlers, loadWhiskyPages} from './grabber';
import {overwriteCurrentLine} from './helper';
import {WhiskyPage} from './model';

export const initialize = async () => {
  const bottlers = await loadBottlers();

  const whiskyPages: WhiskyPage[] = [];

  for (const bottler of bottlers) {
    whiskyPages.push(...(await loadWhiskyPages(bottler)));

    const position =
      bottlers.findIndex(value => value.name === bottler.name) + 1;

    overwriteCurrentLine(
      `${Math.ceil((position / bottlers.length) * 100)}% of Whisky Pages loaded`
    );
  }

  process.stdout.write('\n');

  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(
    `The script uses approximately ${Math.round(used * 100) / 100} MB`
  );
};

initialize();
