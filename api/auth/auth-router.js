const router = require("express").Router();
const authModel = require("./auth-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secret/index");

router.post("/register", async (req, res, next) => {
  // res.end("kayıt olmayı ekleyin, lütfen!");
  try {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = {
      username: username,
      password: hashedPassword,
    };
    const insertedUser = await authModel.create(newUser);
    res.status(201).json(insertedUser);
  } catch (error) {
    next(error);
  }

  /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.
    2^8 HASH TURUNU AŞMAYIN!

    1- Yeni bir hesap kaydetmek için istemci "kullanıcı adı" ve "şifre" sağlamalıdır:
      {
        "username": "Captain Marvel", // `users` tablosunda var olmalıdır
        "password": "foobar"          // kaydedilmeden hashlenmelidir
      }

    2- BAŞARILI kayıtta,
      response body `id`, `username` ve `password` içermelidir:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- Request bodyde `username` ya da `password` yoksa BAŞARISIZ kayıtta,
      response body şunu içermelidir: "username ve şifre gereklidir".

    4- Kullanıcı adı alınmışsa BAŞARISIZ kayıtta,
      şu mesajı içermelidir: "username alınmış".
  */
});

router.post("/login", async (req, res, next) => {
  // res.end("girişi ekleyin, lütfen!");
  try {
    const { username, password } = req.body;
    const user = await authModel.getBy({ username: username });
    const isPasswordMatched = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatched) {
      res.status(400).json({ message: "geçersiz kriterler" });
    } else {
      const payload = {
        username: username,
        id: user.id,
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
      res.status(201).json({
        message: `${user.username} geri geldi!`,
        token: token,
      });
    }
  } catch (error) {
    next(error);
  }
//deneme10
  /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.

    1- Var olan bir kullanıcı giriş yapabilmek için bir `username` ve `password` sağlamalıdır:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- BAŞARILI girişte,
      response body `message` ve `token` içermelidir:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- req body de `username` ya da `password` yoksa BAŞARISIZ giriş,
      şu mesajı içermelidir: "username ve password gereklidir".

    4- "username" db de yoksa ya da "password" yanlışsa BAŞARISIZ giriş,
      şu mesajı içermelidir: "geçersiz kriterler".
  */
});

module.exports = router;
