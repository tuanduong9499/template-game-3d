const fs = require("fs");
const packageJSON = require("../package.json");

let licenseFileText = `/* Copyright (C) Pureative Ltd. Co. - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written by Khiem Nguyen <khiem.nguyen@pureative.com>, April 2020
*/
`;

fs.writeFile("./LICENSE", licenseFileText, function(err) {
  if (err) {
    return console.log(err);
  }
  console.log("The LICENSE file was saved!");
});

packageJSON.author = "Pureative Co., Ltd.";
packageJSON.license = "SEE LICENSE IN LICENSE";
packageJSON.private = true;
packageJSON.description = "This is a private project belongs to Pureative Co., Ltd. All rights reversed";

fs.writeFile("./package.json",
  `${JSON.stringify(packageJSON, null, 2) }\n`,
  writeJSON);

function writeJSON(err) {
  if (err) {
    return console.log(err);
  }
  console.log("Modified package.json saved");
}
