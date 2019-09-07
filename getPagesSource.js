// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

function DOMtoString(document_root) {
  var html = "",
    node = document_root.firstChild;
  while (node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        html += node.outerHTML;
        break;
      case Node.TEXT_NODE:
        html += node.nodeValue;
        break;
      case Node.CDATA_SECTION_NODE:
        html += "<![CDATA[" + node.nodeValue + "]]>";
        break;
      case Node.COMMENT_NODE:
        html += "<!--" + node.nodeValue + "-->";
        break;
      case Node.DOCUMENT_TYPE_NODE:
        // (X)HTML documents are identified by public identifiers
        html +=
          "<!DOCTYPE " +
          node.name +
          (node.publicId ? ' PUBLIC "' + node.publicId + '"' : "") +
          (!node.publicId && node.systemId ? " SYSTEM" : "") +
          (node.systemId ? ' "' + node.systemId + '"' : "") +
          ">\n";
        break;
    }
    node = node.nextSibling;
  }
  return html;
}

function DOMtoXPATH(document_root) {
  var html = "",
    node = document_root.firstChild;
  while (node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        html += node.outerHTML;
        break;
      case Node.TEXT_NODE:
        html += node.nodeValue;
        break;
      case Node.CDATA_SECTION_NODE:
        html += "<![CDATA[" + node.nodeValue + "]]>";
        break;
      case Node.COMMENT_NODE:
        html += "<!--" + node.nodeValue + "-->";
        break;
      case Node.DOCUMENT_TYPE_NODE:
        // (X)HTML documents are identified by public identifiers
        html +=
          "<!DOCTYPE " +
          node.name +
          (node.publicId ? ' PUBLIC "' + node.publicId + '"' : "") +
          (!node.publicId && node.systemId ? " SYSTEM" : "") +
          (node.systemId ? ' "' + node.systemId + '"' : "") +
          ">\n";
        break;
    }
    node = node.nextSibling;
  }

  var premiumAccounts = [];
  var profilesRows = $('*[class^="Card-style-containerLink"]');
  $.each(profilesRows, function(index, value) {
    var link = value.href;
    var name = $(value).find('*[class^="MemberCard-style-title"]')[0].innerHTML;
    var type = $(value).find('*[class^="malt-userbadge"]')[0].children[0]
      .innerHTML;

    var obj = { name: name, link: link, type: type, timestamp: Date.now() };

    if (type === "Premium") {
      premiumAccounts.push(obj);
    }

    console.log(link + " " + name + " " + type);
  });

  // STROGRAGE
  chrome.storage.sync.set({ Runvalues: premiumAccounts }, function() {
    //console.log("Runvalues is set to " + premiumAccounts);
  });

  var returnedAccounts;
  var returnedAccounts = chrome.storage.sync.get(["Runvalues"], function(
    result
  ) {
    returnedAccounts = result.Runvalues;
    //console.log("Value currently is " + result.Runvalues);
    return result.Runvalues;
  });
  // STROGRAGE
  var UserInfo = [];
  // **********************************************************************

  //PAGINATION

  var pagesNumbersRow = $('*[class^="malt-pagination-Pagination-link-"]');
  var pagesToLoop = pagesNumbersRow[pagesNumbersRow.length - 2].innerText;

  console.log(pagesToLoop);
  function GiveBackUrl(url){
    var queryUrl="";
    if(url.search.lastIndexOf('&page')){
      queryUrl=url.search.slice(0,url.search.lastIndexOf('&page'));
    }
    else{
      queryUrl=url.search;
    }
    console.log('our URL IS',queryUrl)
    return queryUrl;
  }
  function download(filename, text) {
    var element = document.createElement("a");
    // all this is so data appears in a clean way when opened in a text editor
    let plainText = "";
    text.map(x => {
      plainText += `Name: ${x.UserName},
      Profile-Link:${x.link},
      Img-Link:${x.img},
      Location:${x.location},  \n \n \t`;
    });
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(plainText)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  setTimeout(function timer() {
    console.log("Will wait for 3000 seconds");
  }, 3000);
  var paginationClass = '*[class^="malt-pagination-Pagination-link-"]';
  var buttonToClick = $('*[class^="malt-pagination-Pagination-link-"]')[
    $(paginationClass).length - 1
  ];
  var pageNation = 1;
  for (i = 1; i <= pagesToLoop; i++) {
    setTimeout(function() {
      console.log("Will wait for 5 seconds", buttonToClick);
      // gathers the data through the given API
      fetch(
        `https://www.xing.com/search/api/results/members${GiveBackUrl(window.location)}&page=${pageNation}`,
        {
          credentials: "include",
          headers: {
            accept: "application/json",
            "accept-language": "en",
            "if-none-match": 'W/"ab05b8db9f7100e6b650094c90103335"',
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
          },
          referrer: `https://www.xing.com/search/members${GiveBackUrl(window.location)}&page=${pageNation}`,
          referrerPolicy: "no-referrer-when-downgrade",
          body: null,
          method: "GET",
          mode: "cors"
        }
      )
        .then(response => response.json())
        .then(data => {
          console.log(data.items);
          // Prints result from `response.json()` in getRequest
          // checks if our arrayOfObject is less than 50
          if (UserInfo.length < 50) {
            for (var k = 0; k < data.items.length; k++) {
              if (UserInfo.length < 50) {
                var dataToBeStored = {
                  UserName: data.items[k].display_name,
                  link: data.items[k].link,
                  img: data.items[k].image,
                  location: data.items[k].location
                };

                UserInfo.push(dataToBeStored);
              } else {
                // downloads our data in a txt file :D
                download("collectedData.txt", UserInfo);
                break;
              }
            }
          }
          console.log("collected data", UserInfo);
        })
        .catch(error => console.error(error));
      pageNation++;

      if (
        $('*[class^="malt-pagination-Pagination-link-"]')[
          $('*[class^="malt-pagination-Pagination-link-"]').length - 1
        ]
      ) {
        buttonToClick = $('*[class^="malt-pagination-Pagination-link-"]')[
          $('*[class^="malt-pagination-Pagination-link-"]').length - 1
        ];
        buttonToClick.click();
      } else {
        buttonToClick.click();
      }
    }, 5000);
  }

  return JSON.stringify(premiumAccounts);
}

chrome.runtime.sendMessage({
  action: "getSource",
  //source: DOMtoString(document)
  source: DOMtoXPATH(document)
});
