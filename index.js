const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

const getOshiData = (accessToken) => {
  // ユーザーのアクセストークンをAPIに渡して、データを取得
  const data = { access_token: accessToken };

  axios
    .post(
      "https://aioshiapp-backend.onrender.com/liffapi/v1/oshi/settings/get",
      data,
      { headers: headers }
    )
    .then((res) => {
      console.log("res:", res);
      const resData = res.data.response_data;
      if ((resData.oshi_name.length = !0)) {
        // 取得したデータをフォームに表示
        $('input[name="oshi_name"]').val(resData.oshi_name);
        $('textarea[name="oshi_info"]').val(resData.oshi_info);
        $('input[name="nickname"]').val(resData.nickname);
        $('input[name="first_person"]').val(resData.first_person);
        $('input[name="second_person"]').val(resData.second_person);
        $('textarea[name="speaking_tone"]').val(resData.speaking_tone);
        $('textarea[name="unused_words"]').val(resData.unused_words);
        $('textarea[name="dialogues"]').val(resData.dialogues);
        $('textarea[name="wanted_words"]').val(resData.wanted_words);
        $('textarea[name="relationship"]').val(resData.relationship);
        $('textarea[name="wanted_action"]').val(resData.wanted_action);
        $('textarea[name="memories"]').val(resData.memories);
        console.log("データ取得完了しました。");
      }
      // ロード画面を非表示
      const spinner = document.getElementById("loading");
      spinner.classList.add("loaded");
    })
    .catch((err) => {
      console.log("err:", err);
      sendText("取得に失敗しました。" + err);
    });
};

const upsertOshiData = (
  accessToken,
  oshiName,
  oshiInfo,
  nickname,
  firstPerson,
  secondPerson,
  speakingTone,
  unusedWords,
  dialogues,
  wantedWords,
  relationship,
  wantedAction,
  memories
) => {
  // ユーザーのアクセストークンをAPIに渡して、データを登録
  const upsert_data = {
    access_token: accessToken,
    request_data: {
      oshi_name: oshiName,
      oshi_info: oshiInfo,
      nickname: nickname,
      first_person: firstPerson,
      second_person: secondPerson,
      speaking_tone: speakingTone,
      unused_words: unusedWords,
      dialogues: dialogues,
      wanted_words: wantedWords,
      relationship: relationship,
      wanted_action: wantedAction,
      memories: memories,
    },
  };

  axios
    .post(
      "https://aioshiapp-backend.onrender.com/liffapi/v1/oshi/settings/update",
      upsert_data,
      { headers: headers }
    )
    .then((res) => {
      // LINEにテキストを送信
      console.log("データ登録完了しました。");
      console.log("res:", res);
      sendText("データ登録完了しました。" + res);
    })
    .catch((err) => {
      console.log("err:", err);
      sendText("登録に失敗しました。" + err);
    });
};

// HTMLが読み込まれるのを待って、liffの初期化を実行
$(document).ready(function () {
  const liffId = "2003651434-4K5ojBw6";
  initializeLiff(liffId);
  const textlist = [];
  // ログイン後、ユーザーのアクセストークンを取得
  liff.ready.then(() => {
    // liff.init()完了後に実行される処理
    if (liff.isLoggedIn()) {
      const accessToken = liff.getAccessToken();
      // ユーザーの登録済みデータを取得
      getOshiData(accessToken);
    }
  });
});

function initializeLiff(liffId) {
  console.log("initializeLiff");
  liff
    .init({
      liffId: liffId,
    })
    .then(() => {
      console.log("LIFF Initialization succeeded");
      initializeApp();

      // liffにログイン
      if (!liff.isLoggedIn()) {
        console.log("ログインしていません");
        liff.login();
      }
    })
    .catch((err) => {
      console.log("LIFF Initialization failed ", err);
    });
}

// LINEにメッセージを送信
function sendText(text) {
  liff
    .sendMessages([
      {
        type: "text",
        text: text,
      },
    ])
    .then(function () {
      liff.closeWindow();
    })
    .catch(function (error) {
      window.alert("Failed to send message " + error);
    });
}

const params = new URL(document.location).searchParams;
const key = params.get("key");

$(function () {
  $("form").submit(function () {
    const oshiName = $('input[name="oshi_name"]').val();
    const oshiInfo = $('textarea[name="oshi_info"]').val();
    const nickname = $('input[name="nickname"]').val();
    const firstPerson = $('input[name="first_person"]').val();
    const secondPerson = $('input[name="second_person"]').val();
    const speakingTone = $('textarea[name="speaking_tone"]').val();
    const unusedWords = $('textarea[name="unused_words"]').val();
    const dialogues = $('textarea[name="dialogues"]').val();
    const wantedWords = $('textarea[name="wanted_words"]').val();
    const relationship = $('textarea[name="relationship"]').val();
    const wantedAction = $('textarea[name="wanted_action"]').val();
    const memories = $('textarea[name="memories"]').val();

    // const accessToken = liff.getAccessToken();
    // // フォームのデータをAPIに渡して、データを登録
    // upsertOshiData(
    //   accessToken,
    //   oshiName,
    //   oshiInfo,
    //   nickname,
    //   firstPerson,
    //   secondPerson,
    //   speakingTone,
    //   unusedWords,
    //   dialogues,
    //   wantedWords,
    //   relationship,
    //   wantedAction,
    //   memories
    // );
    liff.ready.then(() => {
      // liff.init()完了後に実行される処理
      if (liff.isLoggedIn()) {
        const accessToken = liff.getAccessToken();
        // フォームのデータをAPIに渡して、データを登録
        upsertOshiData(
          accessToken,
          oshiName,
          oshiInfo,
          nickname,
          firstPerson,
          secondPerson,
          speakingTone,
          unusedWords,
          dialogues,
          wantedWords,
          relationship,
          wantedAction,
          memories
        );
      }
    });

    sendText("登録完了しました！");
    return false;
  });
});
