/**
 * @jest-environment puppeteer
 */
// ------------ Note: To use puppeteer on jest -------------
// https://github.com/smooth-code/jest-puppeteer
// 1. yarn add -D puppeteer jest-puppeteer
// 2. yarn add -D @types/puppeteer @types/jest-environment-puppeteer @types/expect-puppeteer
// 3. In "jest.config.js" add
//      "preset": "jest-puppeteer" 
// 4. Add "@jest-environment puppeteer" comment on top of each test files like this file.
// 5. import "expect-puppeteer".
// 6. Now you can use "page" object.
// --------------------------------------------------------
// TO RESEARCH
// - Using puppeteer-core & installed chrome (able to detect installed chrome on windows?)

import 'expect-puppeteer';
import "../src/store/index";

describe('E２Eテストサンプル', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/');
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait for components to be mounted.
  });

  test('HTMLタイトルに15パズルを含む', async () => {
    expect(await page.title()).toContain("15パズル");
  });

  test('「１５パズル」を含む文字列が表示されている', async () => {
    expect((await page.$eval("body", elem => (elem as HTMLElement).innerText))).toContain("１５パズル");
  });

  test('4 X 4の盤面が表示されている', async () => {
    expect(await page.$(".BoardPanel")).toBeTruthy();
  });

  test('枠の中に1～15のボタンと空きマスが表示されている', async () => {
    const texts =  await page.$$eval(".SlideButton", elems=>elems.map(elem => (elem as HTMLElement).innerText));
    expect(texts.length).toBe(16);
    expect(texts.sort()).toEqual(["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15",""].sort());
  });

  test('シャッフルボタンが表示されている', async () => {
    expect(await page.$(".ShuffleButton")).toBeTruthy();
  });
  
  test('シャッフルボタンをクリックすると、盤面がシャッフルされ、「シャッフルしました」ダイアログが表示される', async () => {
    const otexts =  await page.$$eval(".SlideButton", elems=>elems.map(elem => (elem as HTMLElement).innerText));
    await (await page.$(".ShuffleButton")).click();
    const texts =  await page.$$eval(".SlideButton", elems=>elems.map(elem => (elem as HTMLElement).innerText));
    expect(texts).not.toEqual(otexts);
    // ダイアログ
    expect(await page.$(".MessageDialog")).toBeTruthy();
    expect(await page.$eval(".MessageDialog", el => (el as HTMLElement).innerText)).toContain("シャッフルしました");
    await (await page.$(".MessageDialog button")).click();
    expect(await page.$(".MessageDialog")).toBeFalsy();
  });

  test('ステートストアが取得できる', async () => {
    expect(await page.evaluate(() => {
      const store = window.__stores__?.["default"];
      return !!store;
    })).toBeTruthy();
  });

  test('ステートストアがE2Eテスト内で更新できる', async () => {
    // Note: evaluateの中では、importした関数は使用できない事に注意する。
    await page.evaluate(() => {
      const store = window.__stores__?.["default"];
      store.dispatch(() => ({
        ...store.root,
        board: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, null, 14, 15],
      }));
      return store.root.board;
    });
    await page.waitForTimeout(1200); // Wait for the components to be updated.

    const texts =  await page.$$eval(".SlideButton", elems=>elems.map(elem => (elem as HTMLElement).innerText));
    expect(texts).toEqual(["1","2","3","4","5","6","7","8","9","10","11","12","13","","14","15"]);
  });

  test('数字ボタンをクリックすると、周囲に空きマスがあればスライドする', async () => {
    const button = await page.waitForXPath('//*[text()="14"]/ancestor-or-self::button');
    await button.click();
    await page.waitForTimeout(1200); // Wait for the components to be updated.

    const texts =  await page.$$eval(".SlideButton", elems=>elems.map(elem => (elem as HTMLElement).innerText));
    expect(texts).toEqual(["1","2","3","4","5","6","7","8","9","10","11","12","13","14","","15"]);
  });

  test('数字ボタンをクリックすると、周囲に空きマスがあればスライドしない', async () => {
    const button = await page.waitForXPath('//*[text()="1"]/ancestor-or-self::button');
    await button.click();
    await page.waitForTimeout(1200); // Wait for the components to be updated.

    const texts =  await page.$$eval(".SlideButton", elems=>elems.map(elem => (elem as HTMLElement).innerText));
    expect(texts).toEqual(["1","2","3","4","5","6","7","8","9","10","11","12","13","14","","15"]);
  });

  test('15パズルの完成時には、ダイアログでメッセージを表示する', async () => {
    const button = await page.waitForXPath('//*[text()="15"]/ancestor-or-self::button');
    await button.click();
    await page.waitForTimeout(1200); // Wait for the components to be updated.

    // ダイアログ
    expect(await page.$(".MessageDialog")).toBeTruthy();
    expect(await page.$eval(".MessageDialog", el => (el as HTMLElement).innerText)).toContain("１～１５の数が揃いました");
    await (await page.$(".MessageDialog button")).click();
  });

});
