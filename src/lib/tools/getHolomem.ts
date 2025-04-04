import { tool } from "ai";
import { z } from "zod";

const hololiveMembers = [
  // Hololive 0期生
  "ときのそら", // Tokino Sora
  "ロボ子さん", // Roboco-san
  "AZKi", // AZKi
  "さくらみこ", // Sakura Miko
  "星街すいせい", // Hoshimachi Suisei

  // Hololive 1期生
  "夜空メル", // Yozora Mel
  "アキ・ローゼンタール", // Aki Rosenthal
  "赤井はあと", // Akai Haato
  "白上フブキ", // Shirakami Fubuki
  "夏色まつり", // Natsuiro Matsuri

  // Hololive 2期生
  "紫咲シオン", // Murasaki Shion
  "百鬼あやめ", // Nakiri Ayame
  "癒月ちょこ", // Yuzuki Choco
  "大空スバル", // Oozora Subaru

  // Hololive GAMERS
  "大神ミオ", // Ookami Mio
  "猫又おかゆ", // Nekomata Okayu
  "戌神ころね", // Inugami Korone

  // Hololive 3期生
  "兎田ぺこら", // Usada Pekora
  "不知火フレア", // Shiranui Flare
  "白銀ノエル", // Shirogane Noel
  "宝鐘マリン", // Houshou Marine

  // Hololive 4期生
  "天音かなた", // Amane Kanata
  "角巻わため", // Tsunomaki Watame
  "常闇トワ", // Tokoyami Towa
  "姫森ルーナ", // Himemori Luna

  // Hololive 5期生
  "雪花ラミィ", // Yukihana Lamy
  "桃鈴ねね", // Momosuzu Nene
  "獅白ぼたん", // Shishiro Botan
  "尾丸ポルカ", // Omaru Polka

  // Hololive 6期生 (秘密結社holoX)
  "ラプラス・ダークネス", // La+ Darknesss
  "鷹嶺ルイ", // Takane Lui
  "博衣こより", // Hakui Koyori
  "沙花叉クロヱ", // Sakamata Chloe
  "風真いろは", // Kazama Iroha

  // Hololive Indonesia 1期生
  "アユンダ・リス", // Ayunda Risu
  "ムーナ・ホシノヴァ", // Moona Hoshinova
  "アイラニ・イオフィフティーン", // Airani Iofifteen

  // Hololive Indonesia 2期生
  "クレイジー・オリー", // Kureiji Ollie
  "アーニャ・メルフィッサ", // Anya Melfissa
  "パヴォリア・レイネ", // Pavolia Reine

  // Hololive Indonesia 3期生
  "ベスティア・ゼータ", // Vestia Zeta
  "カエラ・コヴァルスキア", // Kaela Kovalskia
  "こぼ・かなえる", // Kobo Kanaeru

  // Hololive English -Myth-
  "森カリオペ", // Mori Calliope
  "小鳥遊キアラ", // Takanashi Kiara
  "一伊那尓栖", // Ninomae Ina'nis
  "がうる・ぐら", // Gawr Gura
  "ワトソン・アメリア", // Watson Amelia

  // Hololive English -Project: HOPE-
  "アイリス", // IRyS

  // Hololive English -Council-
  "セレス・ファウナ", // Ceres Fauna
  "オーロ・クロニー", // Ouro Kronii
  "七詩ムメイ", // Nanashi Mumei
  "ハコス・ベールズ", // Hakos Baelz

  // Hololive English -Advent-
  "シオリ・ノヴェラ", // Shiori Novella
  "古石ビジュー", // Koseki Bijou
  "ネリッサ・レイヴンクロフト", // Nerissa Ravencroft
  "モココ・アビスガード", // Mococo Abyssgard
  "フワワ・アビスガード", // Fuwawa Abyssgard

  // Hololive English -Justice-
  "エリザベス・ローズ・ブラッドフレイム", // Elizabeth Rose Bloodflame
  "ジジ・ムリン", // Gigi Murin
  "セシリア・イマーグリーン", // Cecilia Immergreen
  "ラオーラ・パンテーラ", // Raora Panthera

  // Hololive DEV_IS -ReGLOSS-
  "火威青", // Hiodoshi Ao
  "音乃瀬奏", // Otonose Kanade
  "一条莉々華", // Ichijou Ririka
  "儒烏風亭らでん", // Juufuutei Raden
  "轟はじめ", // Todoroki Hajime

  // Hololive DEV_IS -FLOW GLOW-
  "響咲リオナ", // Isaki Riona
  "虎金妃笑虎", // Koganei Niko
  "水宮枢", // Mizumiya Su
  "輪堂千速", // Rindo Chihaya
  "綺々羅々ヴィヴィ" // Kikirara Vivi
];

export const getHoloMemTool = tool({
  description: "取得Hololive成員的名字清單",
  parameters: z.object({}),
  execute: async () => {
    const shuffled = hololiveMembers.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }
})