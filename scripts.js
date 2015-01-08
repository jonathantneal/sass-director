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
      smallerStr = '',
      quotationStyle = '"',
      subdirCount = 0,
      underscore = '_', //default
      outputPlatter = document.getElementById('output-text'),
      i, lines;

  //function to add files (we don't do this until later)
  function addFiles() {
    if (currentDir === lastDir) { //if the current lines dir is the same as the last one
      finalOutput += 'touch ' + underscore + currentFile + extension + ';';
    }
    else { //if current dir != last one
      if (i > 0) { finalOutput += 'cd ../;' } //dont cd for the first line
      finalOutput += 'mkdir ' + currentDir + ';cd ' + currentDir +';' + 'touch ' + underscore + currentFile + extension + ';';
    }
  }

  // ORDER STARTS HERE

  // Get the input & options here
  inputText = document.getElementById('input-text').value;
  extension = document.querySelector('input[name="extension"]:checked').value;
  if (!document.querySelector('input[name="underscore"]').checked) {
    underscore = '';
  }

  lines = inputText.split('\n'); //split up the lines in the string into a lines array
  for(i = 0; i < lines.length; i++) {
    if (lines[i].charAt(0) === '@') { //skip blank lines & comments

      subdirCount = ((lines[i]).match(/\//g) || []).length-1; //get # of subdirectories in the line
      quotationStyle = lines[i].charAt(8); //the first character after '@import ' is the quotation style
      currentFile = between(lines[i],'/', quotationStyle); //get file created in this line

      if (subdirCount > 0) {
            smallerStr = lines[i].replace(currentDir + '/',''); //remove the dir before
            console.log(smallerStr);
            currentDir = between(smallerStr, quotationStyle, '/');
            currentFile = between(smallerStr,'/', quotationStyle);
            addFiles();
            lastDir = currentDir;
            //recursive function removed everything before the '/' and goes through everything again
            // after the recursive function, cd back to the begining the number of directories deep we went
      }
      else { //if theres only one subdir
        currentDir = between(lines[i], quotationStyle, '/'); //get the directory this line refers to
      }

      addFiles();
      lastDir = currentDir;
    }
  }
  outputPlatter.value = finalOutput;
}
