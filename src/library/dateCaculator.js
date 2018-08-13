import { cn } from "nzh";

function cacGanZhi(year) {
  const gs = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

  const zs = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

  let gan = year % 10 - 3, zhi = year % 12 - 3;
  gan = gan > 0 ? gan : gan + 10;
  zhi = zhi > 0 ? zhi : zhi + 12;

  return gs[gan - 1] + zs[zhi - 1];
}

function transChineseNumber(num) {
  return cn.decodeS(num.replace("初", "").replace("正", "一"));
}

function caculateYear(year) {
  const map = {
    洪武: 1368,
    建文: 1399,
    永乐: 1402,
    洪熙: 1425,
    宣德: 1426,
    正统: 1436,
    景泰: 1450,
    天顺: 1457,
    成化: 1465,
    弘治: 1488,
    正德: 1506,
    嘉清: 1522,
    隆庆: 1567,
    万历: 1573,
    泰昌: 1620,
    天启: 1621,
    崇祯: 1628,
    顺治: 1644,
    康熙: 1661,
    雍正: 1722,
    乾隆: 1735,
    嘉庆: 1795,
    道光: 1820,
    咸丰: 1850,
    同治: 1861,
    光绪: 1875,
    宣统: 1908,
    民国: 1912,
    共和: 1949
  };

  const ganzhi = [
    "甲子",
    "乙丑",
    "丙寅",
    "丁卯",
    "戊辰",
    "己巳",
    "庚午",
    "辛未",
    "壬申",
    "癸酉",
    "甲戌",
    "乙亥",
    "丙子",
    "丁丑",
    "戊寅",
    "己卯",
    "庚辰",
    "辛巳",
    "壬午",
    "癸未",
    "甲申",
    "乙酉",
    "丙戌",
    "丁亥",
    "戊子",
    "己丑",
    "庚寅",
    "辛卯",
    "壬辰",
    "癸巳",
    "甲午",
    "乙未",
    "丙申",
    "丁酉",
    "戊戌",
    "己亥",
    "庚子",
    "辛丑",
    "壬寅",
    "癸卯",
    "甲辰",
    "乙巳",
    "丙午",
    "丁未",
    "戊申",
    "己酉",
    "庚戌",
    "辛亥",
    "壬子",
    "癸丑",
    "甲寅",
    "乙卯",
    "丙辰",
    "丁巳",
    "戊午",
    "己未",
    "庚申",
    "辛酉",
    "壬戌",
    "癸亥"
  ];

  let yearStart = 0, yearName = "", originIndex = 0, pos = 0, nianHao = "";
  Object.entries(map).forEach(entry => {
    pos = year.indexOf(entry[0]);
    if (pos > -1) {
      nianHao = entry[0];
      yearStart = entry[1];
      yearName = cacGanZhi(yearStart);
      originIndex = ganzhi.indexOf(yearName);
      return yearStart;
    }
  });

  let currentIndex = -1;
  Object.entries(ganzhi).forEach(entry => {
    if (year.indexOf(entry[1]) > -1) {
      currentIndex = entry[0];
      return currentIndex;
    }
  });

  if (currentIndex === -1) {
    let cnYear = year.slice(
      year.indexOf(nianHao) + nianHao.length,
      year.indexOf("年")
    );
    return yearStart + transChineseNumber(cnYear);
  } else {
    let yearGap = currentIndex - originIndex;
    return yearStart + (yearGap >= 0 ? yearGap : yearGap + 60);
  }
}

function cacMonth(date) {
  const month = date.slice(date.indexOf("年") + 1, date.indexOf("月"));

  return transChineseNumber(month);
}

function cacDay(date) {
  const day = date.slice(date.indexOf("月") + 1, date.indexOf("日"));

  return transChineseNumber(day);
}

function cacHour(date) {
  const hour = date.slice(date.indexOf("日") + 1, date.indexOf("时"));
  const zs = {
    子: "23:00",
    丑: "1:00",
    寅: "3:00",
    卯: "5:00",
    辰: "7:00",
    巳: "9:00",
    午: "11:00",
    未: "13:00",
    申: "15:00",
    酉: "17:00",
    戌: "19:00",
    亥: "21:00"
  };
  return zs[hour] || "0:00";
}

function translateDate(date) {
  return (
    caculateYear(date) +
    "/" +
    cacMonth(date) +
    "/" +
    cacDay(date) +
    " " +
    cacHour(date)
  );
}

export default {
  cacGanZhi,
  transChineseNumber,
  caculateYear,
  cacMonth,
  cacDay,
  cacHour,
  translateDate
};
