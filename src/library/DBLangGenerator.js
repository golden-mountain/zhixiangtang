import { cloneDeep } from "lodash";
import dateCaculators from "./library/dateCaculator";
const { translateDate } = dateCaculators;

export default function getCode(yamlObject) {
  const excludes = ["toggled", "children", "name", "active"];
  const tidyData = data => (data ? data.replace(/[[(](.*?)[\])]/, "$1") : data);

  const createPersonLang = (element, variableName) => {
    excludes.forEach(key => {
      if (element[key] !== undefined) {
        delete element[key];
      }
    });
    // const json = JSON.stringify(element);
    let valuePairs = [];
    Object.entries(element).forEach(entry => {
      if (!Array.isArray(entry[1])) {
        let key = tidyData(entry[0]);
        let value = tidyData(entry[1]);
        if (key === "生") {
          const seconds = new Date(translateDate(value)).getTime() || 0;
          valuePairs.push("日:" + seconds);
        }
        if (key === "殁") {
          const seconds = new Date(translateDate(value)).getTime() || 0;
          valuePairs.push("死:" + seconds);
        }
        valuePairs.push(key + ': "' + value + '"');
      }
    });
    let json = "{" + valuePairs.join(", ") + "}";
    let createPerson = `CREATE (${variableName}:Person${json})`;
    return createPerson;
  };

  const formatData = (data, person = "") => {
    let d = [], relation = [];
    data.forEach((element, index) => {
      let name = tidyData(element["名"]);
      let variableName = name + "_" + index;

      if (person) {
        variableName = person + "_" + variableName;
        let createRelation = `CREATE (${variableName})-[:RELATION{role: 'son'}]->(${tidyData(person)})`;
        relation.push(createRelation);
      }

      let createPerson = createPersonLang(element, variableName);
      d.push(createPerson);

      if (element["子"]) {
        const sub = formatData(element["子"], variableName);
        d = d.concat(sub);
        delete element["子"];
        delete element["children"];
      }

      if (person) {
        let createRelation = `CREATE (${variableName})-[:RELATION{role: 'son'}]->(${tidyData(person)})`;
        relation.push(createRelation);
      }

      if (element["妻"]) {
        element["妻"].forEach((w, i) => {
          let wifeName = variableName + "_妻_" + tidyData(w["名"]) + "_" + i;
          let createRelation = `CREATE (${wifeName})-[:RELATION{role: 'wife'}]->(${variableName})`;
          relation.push(createRelation);
          let createPerson = createPersonLang(w, wifeName);
          d.push(createPerson);
        });
        delete element["妻"];
      }

      if (element["女"]) {
        element["女"].forEach((w, i) => {
          let daughterName = variableName + "_女_" + tidyData(w["名"]) + "_" + i;
          let createRelation = `CREATE (${daughterName})-[:RELATION{role: 'daughter'}]->(${variableName})`;
          relation.push(createRelation);
          let createPerson = createPersonLang(w, daughterName);
          d.push(createPerson);
        });
        delete element["女"];
      }
    });
    d = d.concat(relation);
    return d;
  };
  const clonedObject = cloneDeep(yamlObject);
  const flattedObject = formatData(clonedObject);
  // console.log(flattedObject);
  return flattedObject.join("\n\r");
}
