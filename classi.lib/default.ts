import { CLCOOKIE } from "./type"
export const YEAR: number = new Date().getFullYear();

function getcsrf(cookie: CLCOOKIE): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    fetch("https://id-api.classi.jp/api/v1/csrf_token", {
      headers: {
        Cookie: cookie,
      },
    })
      .then((r) => {
        const cookie = r.headers.get("Set-Cookie");
        r.json().then((res) => {
          resolve([cookie, res.data]);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function withpass(
  cookie: CLCOOKIE,
  username: string,
  pass: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const csrf = await getcsrf(cookie);
    const body = {
      username: username,
      password: pass,
      saveId: false,
    };
    cookie = csrf[0];
    fetch("https://id-api.classi.jp/api/v1/login/with_password", {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
        "X-Csrf-Token": csrf[1],
      },
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => {
      resolve(String(res.headers.get("Set-Cookie")));
    });
  });
}

function contin(cookie: CLCOOKIE): Promise<string> {
  return new Promise(async (resolve, reject) => {
    fetch("https://id-api.classi.jp/api/v1/login/continue", {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      method: "GET",
    })
      .then((res) => {
        resolve(String(res.headers.get("Set-Cookie")));
      })
      .catch((err) => reject(err));
  });
}

export function getCookies(
  username: string,
  pass: string
): Promise<CLCOOKIE> {
  return new Promise(async (resolve, reject) => {
    let cookie: string;
    cookie = await withpass("", username, pass);
    cookie = await contin(cookie);
    const csrf = await getcsrf(cookie);
    fetch("https://id-api.classi.jp/api/v1/login/issue_cookie", {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
        "X-Csrf-Token": csrf[1],
      },
      method: "POST",
    })
      .then((res) => {
        cookie = String(res.headers.get("Set-Cookie"));
        let status: string;
        status = "success";
        resolve(cookie);
      })
      .catch((err) => {
        reject({ status: "Retry", cookie: "" });
      });
  });
}

export function is_valid(cookie: CLCOOKIE): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    fetch("https://platform.classi.jp/communication/api/v1/user", {
      headers: {
        Cookie: cookie,
      },
      method: "GET",
    }).then((res) => {
      const st = res.status;
      if (st == 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

export function test(username: string, password: string): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    const cookie = await getCookies(username, password);
    const whether = await is_valid(cookie);
    resolve(whether);
  });
}
