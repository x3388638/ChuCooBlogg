Homework for building a blog system.
- only one user (default account password: admin/123456)

client side
- jQuery
- Bootstrap 4

server side
- nodejs + express


Usage: 
```
git clone https://github.com/x3388638/ChuCooBlogg.git
cd ChuCooBlogg
npm install
npm start
```
open browser http://127.0.0.1:65432/


ChuCooBlog API docs
====

測試用 API Server: 
- `https://richegg.top` by richegg (PHP)
	- 帳號：`test1`
	- 密碼：`test123`
- `https://moli.rocks:774` by yy (Node)
	- 帳號：`admin`
	- 密碼：`123456`


## Data Model

### Author
```
{
  "username": (string),
  "name": (string),
  "gender": (string f, m, o),
  "address": (string)
}
```

### Post
```
{
  "id": (number),
  "title": (string),
  "content": (string),
  "created_at": (datetime string ISO-8601),
  "updated_at": (datetime string ISO-8601),
  "author": (Author object),
  "tags": (string array)
}
```
## 功能
- 登入
- 取得某使用者資料
- 修改某使用者資料
- 取得文章列表
- 取得某篇文章
- 新增文章
- 修改文章
- 刪除文章

## API

### 登入
POST `/login`

#### Request
```
{
  "username": (string),
  "password": (string)
}
```

#### Res
##### 200 (ok)
Author object

**範例**
POST `/login`

```
{
  "username": 'yuer',
  "name": 'Yuer Lee',
  "gender": 'm',
  "address": '南投縣埔里鎮大學路1號'
}
```

### 確認登入狀態
GET `/login`

#### Request
none

#### Res
##### 200 (ok)
Author object

**範例**
GET `/login`

```
{
  "username": 'yuer',
  "name": 'Yuer Lee',
  "gender": 'm',
  "address": '南投縣埔里鎮大學路1號'
}
```

### 取得某使用者資料
GET `/authors/:id`

#### Request
none
#### Res
##### 200
Author object

**範例**
GET `/authors/yuer`

```
{
  "username": 'yuer',
  "name": 'Yuer Lee',
  "gender": 'm',
  "address": '南投縣埔里鎮大學路1號'
}
```

### 修改某使用者資料
PATCH `/authors/:id`

#### Request
```
{
  "password": (string),
  "name": (string),
  "gender": (string f, m, o),
  "address": (string)
}
```
#### Res
##### 200
Author object

**範例**
PATCH `/authors/yuer`

```
{
  "username": 'yuer',
  "name": 'Yuer Lee',
  "gender": 'm',
  "address": '南投縣埔里鎮大學路1號'
}
```

### 取得文章列表
GET `/posts`

#### Request
none
#### Res
##### 200
Post object array

**範例**
GET `/posts`

```
[
  {
    "id": 1,
    "title": '我來我見我吃飯',
    "content": '此地共至也推門中特感子那位？決絕自時感，著到驗從背教成食、長雨為，連爸令的源，招風入在洋成青希，樹魚美，體海親雲，地價面南。受變時的類人了高落；件前綠果什大求身院，難每品供感候坐我家語熱體近落一發。過也完省情無東品這近的受論，差象提美英那。香水來組戰香不！教海到保，立委明呢！快到只本難前議發圖如何化笑次過部放大師就雙看過望小：說受子電子考建學於三。',
    "created_at": '2017-06-16T06:25:08+00:00',
    "updated_at": '2017-06-16T06:25:08+00:00',
    "author": {
      "username": 'yuer',
      "name": 'Yuer Lee',
      "gender": 'm',
      "address": '南投縣埔里鎮大學路1號'
    },
    "tags": ['至理名言', '短文集']
  }
]
```

### 取得某篇文章
GET `/posts/:id`

#### Request
none
#### Res
##### 200
Post object

**範例**
GET `/posts/1`

```
{
  "id": 1,
  "title": '我來我見我吃飯',
  "content": '此地共至也推門中特感子那位？決絕自時感，著到驗從背教成食、長雨為，連爸令的源，招風入在洋成青希，樹魚美，體海親雲，地價面南。受變時的類人了高落；件前綠果什大求身院，難每品供感候坐我家語熱體近落一發。過也完省情無東品這近的受論，差象提美英那。香水來組戰香不！教海到保，立委明呢！快到只本難前議發圖如何化笑次過部放大師就雙看過望小：說受子電子考建學於三。',
  "created_at": '2017-06-16T06:25:08+00:00',
  "updated_at": '2017-06-16T06:25:08+00:00',
  "author": {
    "username": 'yuer',
    "name": 'Yuer Lee',
    "gender": 'm',
    "address": '南投縣埔里鎮大學路1號'
  },
  "tags": ['至理名言', '短文集']
}
```


### 新增文章
POST `/posts`

#### Request

```
{
  "title": (string),
  "content": (string),
  "tags": (string array)
}
```
#### Res
##### 201
Post object

**範例**
POST `/posts`

```
{
  "id": 1,
  "title": '我來我見我吃飯',
  "content": '此地共至也推門中特感子那位？決絕自時感，著到驗從背教成食、長雨為，連爸令的源，招風入在洋成青希，樹魚美，體海親雲，地價面南。受變時的類人了高落；件前綠果什大求身院，難每品供感候坐我家語熱體近落一發。過也完省情無東品這近的受論，差象提美英那。香水來組戰香不！教海到保，立委明呢！快到只本難前議發圖如何化笑次過部放大師就雙看過望小：說受子電子考建學於三。',
  "created_at": '2017-06-16T06:25:08+00:00',
  "updated_at": '2017-06-16T06:25:08+00:00',
  "author": {
    "username": 'yuer',
    "name": 'Yuer Lee',
    "gender": 'm',
    "address": '南投縣埔里鎮大學路1號'
  },
  "tags": ['至理名言', '短文集']
}
```

##### error
```
{
  "message" (string)
}
```


### 修改文章
PATCH `/posts/:id`

#### Request
```
{
  "title": (string),
  "content": (string),
  "tags": (string array)
}
```

#### Res
##### 200
Post object

**範例**
PATCH `/posts/1`

```
{
  "id": 1,
  "title": '我來我見我吃飯',
  "content": '此地共至也推門中特感子那位？決絕自時感，著到驗從背教成食、長雨為，連爸令的源，招風入在洋成青希，樹魚美，體海親雲，地價面南。受變時的類人了高落；件前綠果什大求身院，難每品供感候坐我家語熱體近落一發。過也完省情無東品這近的受論，差象提美英那。香水來組戰香不！教海到保，立委明呢！快到只本難前議發圖如何化笑次過部放大師就雙看過望小：說受子電子考建學於三。',
  "created_at": '2017-06-16T06:25:08+00:00',
  "updated_at": '2017-06-16T06:25:08+00:00',
  "author": {
    "username": 'yuer',
    "name": 'Yuer Lee',
    "gender": 'm',
    "address": '南投縣埔里鎮大學路1號'
  },
  "tags": ['至理名言', '短文集']
}
```

### 刪除文章
DELETE `/posts/:id`

#### Request
none

#### Res
##### 200
```
{
  "remain": (number)
}
```
