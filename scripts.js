// split a string to get text between before & after characters
function between(input, before, after) {
  var i = input.indexOf(before);
  if (i >= 0) {
    input = input.substring(i + before.length);
  }
  else {
    return '';
  }
  if (after) {
    i = input.indexOf(after);
    if (i >= 0) {
      input = input.substring(0, i);
    }
    else {
      return '';
    }
  }
  return input;
}

function doTheThing() {
  var inputText = '',
      extension = '.scss', //default
      lastDir = '',
      currentDir = '',
      currentFile = '',
      finalOutput = '',
      quotationStyle = '"',
      subdirCount = 0,
      totalSubDirs = 0,
      underscore = '_', //default
      outputPlatter = document.getElementById('output-text'),
      i, lines;

  // Get the input & options here
  inputText = document.getElementById('input-text').value;
  extension = document.querySelector('input[name="extension"]:checked').value;
  if (!document.querySelector('input[name="underscore"]').checked) {
    underscore = '';
  }

  lines = inputText.split('\n'); //split up the lines in the string into a lines array
  for(i = 0; i < lines.length; i++) {
    if (lines[i].charAt(0) === '@') { //skip blank lines & comments

      subdirCount = ((lines[i]).match(/\//g) || []).length; //get # of subdirectories in the line

      quotationStyle = lines[i].charAt(8); //the first character after '@import ' is the quotation style

      currentDir = between(lines[i], quotationStyle, '/'); //get the directory this line refers to
      currentFile = between(lines[i],'/', quotationStyle); //get file created in this line

      if (subdirCount > 1) {
          totalSubDirs = subdirCount; //saving for cd-ing out
           //recursive function here
          // while (subdirCount > 1) {
            console.log(subdirCount);
            currentDir = between(lines[i], '/', '/');
            finalOutput += "mkdir " + currentDir + ";";
            // subdirCount--;
          // }
        //when its no longer > 1
        for (i = 0; i < totalSubDirs; i++) {
          finalOutput += 'cd ../'; //cd outta there
        }
        currentDir = between(lines[i], quotationStyle, '/');
      }

      else { //if subdir == 1
        if (currentDir === lastDir) { //if the current lines dir is the same as the last one
          finalOutput += 'touch ' + underscore + currentFile + extension + ';';
        }
        else { //if current dir != last one
          if (i > 0) { finalOutput += 'cd ../;' } //dont cd for the first line
           finalOutput += 'mkdir ' + currentDir + ';cd ' + currentDir +';' + 'touch ' + underscore + currentFile + extension + ';';
        }
        lastDir = currentDir;
      }
    }
  }
  outputPlatter.value = finalOutput;
}
