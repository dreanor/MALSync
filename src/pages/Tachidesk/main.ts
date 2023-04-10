import { pageInterface } from '../pageInterface';
let thisData: any = null;
export const Tachidesk: pageInterface = {
  name: 'Tachidesk',
  domain: 'http://127.0.0.1:4567',
  languages: ['English'],
  type: 'manga',
  isSyncPage(url) {
    return utils.urlPart(url, 5) === 'chapter';
  },
  isOverviewPage(url) {
    return utils.urlPart(url, 3) === 'manga';
  },
  getImage() {
    return j.$('.img').attr('src');
  },
  sync: {
    getTitle(url) {
      return j.$('title').text();
    },
    getIdentifier(url) {
      return utils.urlPart(url, 4) || '';
    },
    getOverviewUrl(url) {
      return thisData.realUrl;
    },
    getEpisode: function (url) {
      return thisData.chapterNumber;
    },
    nextEpUrl(url) {
      return utils.absoluteLink($('.read a:nth-child(4)').attr('href'), Tachidesk.domain);
    },
  },
  overview: {
    getTitle(url) {
      return j.$('h1').text();
    },
    getIdentifier(url) {
      return utils.urlPart(url, 4) || '';
    },
    uiSelector(selector) {
      j.$('.w-100').before(j.html(selector));
    },
  },
  init(page) {
    api.storage.addStyle(
      // eslint-disable-next-line global-require
      require('!to-string-loader!css-loader!less-loader!./style.less').toString(),
    );
    page.handlePage();
    utils.urlChangeDetect(

      async () => {
        thisData = null;
        page.reset();

        let p4 = utils.urlPart(window.location.href, 4);
        let p6 = utils.urlPart(window.location.href, 6);
        
        const response = await fetch(`http://127.0.0.1:4567/api/v1/manga/${p4}/chapter/${p6}`);
        const data = await response.json();
        thisData = data;
        page.handlePage();
      }
    );
  },
};
