const POST_MESSAGE_URL = "https://slack.com/api/chat.postMessage";
const channelName = 'welcome';

function sendToSlack(data) {
  const properties = PropertiesService.getScriptProperties();
  const accessToken = properties.getProperty("accessToken");

  const mention = data.mentions
    .filter(mention => mention != undefined)
    .map(mention => "<@" + mention + ">")
    .join(", ");

  const payload = {
    token: accessToken,
    channel: channelName,
    attachments: [{
      fallback: "入社登録システム",
      pretext: mention +
        "\n下記の通り入社登録を受け付けました。\n" +
        "ご確認ください。",
      fields: data.fields,
      color: "good", //左側のバーの色,
      "footer": "ロギングタイム："
    }],
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: 'Bearer ' + accessToken,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(POST_MESSAGE_URL, options);
}