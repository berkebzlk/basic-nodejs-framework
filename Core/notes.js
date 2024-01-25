/*
****application level middleware
*** takes 1 argument
** middleware
app.use(middleware)

****router level middleware
*** takes n argument
** 1st: uri,
** nth: handler
** middle of 1st and nth: middleware(s)
app.use(uri, middleware(s), handler)

****router
app.use(uri, router)

--------

****Router
*** takes two argument
** 1st: uri
** 2nd: handler
router.get(uri, handler)

*** takes n arguments
** 1st: uri
** nth: handler
** middle of 1st and nth: middleware(s)
router.get(uri, middleware(s), handler)
*/

/*
how to make application level middleware?

response -> (middleware1(middleware2(app))) -> request

app.get('/uri1', handler)

router.routes = {
    'get': {
        '/uri1':[handler],
    },
    'post': [],
    'put': [],
    'patch': [],
    'delete': [],
}

app.get('/uri2', handler2)

router.routes = {
    'get': {
        '/uri1':[handler],
        '/uri2':[handler2],
    },
    'post': [],
    'put': [],
    'patch': [],
    'delete': [],
}

app.use(middleware1) -> application level middleware. This should wrap the entire app

{
    [middleware1],
    routes
}

app.use(middleware2)

{
    [middleware1],
    routes
    [middleware2]
}

app.get('/uri2', handler2)

{
    [middleware1],
    routes
    [middleware2]
    routes
}

OR

app.get('/uri1', handler1)

{
    {'get', [handler1]}
}

app.use(middleware1)

{
    {'get', [handler1]},
    [middleware1]
}

app.get('/uri2', handler2);

{
    {'get': {'/uri1': [handler1]} },
    [middleware1],
    {'get': {'/uri2': [handler2]} },
}

app.route {
    app.applicationRoute.forEach(applicationRoute => {
        if(typeof applicationRoute == 'Array') {
            null;
        } else if(typeof applicationRoute == 'Object') {
            const handlers = applicationObject[httpMethod][uri]
            if(handlers) {
                uri'a gelmiş demektir. handler'ı çalıştır
            }
        }

    })
}
*/

// implementation
/*

routes

router.use(middleware)

router.get(uri, handler)
router.use(uri, handler)
-------------------------

router.get(uri1, handler1)

routes = {
    'get': {'uri': [handler]}
}

router.use(middleware1)

routerApplicationRoutes = {
    'get': {'uri': [handler1]},
    [middleware1]
}

route.use('uri2', handler2)

routerApplicationRoutes = {
    {'get': {'uri': [handler1]},}
    [middleware1]
    {'get': {'uri2': [handler2]}}
    {'post': {'uri2': [handler2]}}
    {'put': {'uri2': [handler2]}}
    {'patch': {'uri2': [handler2]}}
    {'delete': {'uri2': [handler2]}}
}



*/



// implemantation
/*

----router.get(uri, handler)
önce route'lardaki get metotlarını gezecek ve bunlardan birinde uri varsa bunun handlerını değiştirecek
    yoksa yenisini oluşturacak

----router.use(middleware)
route'lara yeni bir veri ekleyecek.
veri tipi {
    [middleware] şeklinde olacak
}

----router.use(uri, handler)
router.get metodunu çalıştıracak

--------------------
----app.use(uri, Router)
Router içerisinde routerApplicationRoutes değişkeninde route'lar tutuluyor
routerApplicationRoutes = {
    {'get': {'uri': [handler1]},}
    [middleware1]
    {'get': {'uri2': [handler2]}}
    {'post': {'uri2': [handler2]}}
    {'put': {'uri2': [handler2]}}
    {'patch': {'uri2': [handler2]}}
    {'delete': {'uri2': [handler2]}}
}
bu değişkeni alacak döngüde dönecek ve aldığı uri'ı buradaki uri'lara ekleyecek
---Eklemeden önce yapılacaklar
applicationRoute içerisinde route ile birleştirilmiş uri değişkenin eşdeğeri var mı?
    Varsa handler'ını değiştir. ve yeni bir field ekle -> routerUri -> appten gelen değişken

middleware mi geldi?
    {'uri': 'rootUri', [middleware1]} olarak ekle
    burada rootUri değeri app'ten verilen uri olacak.

----app.use(uri, handler)
applicationRoutes değişkenine ekleme yapacak
app.get metodunu çalıştıracak
applicationRoutes = {
    {'get': {uri, [handler]} }
}
---ekleme yapmadan önce kontrol yapılacak
    get metodu içinde zaten kontrol yapılıyor

----app.use(middleware)
applicationRoutes değişkenine ekleme yapacak
applicationRoutes = {
    [middleware]
}



    */





// app senario
/*
const myRouter = new Router();
router.get(uri1, handler1)
router.use(middleware1)
route.use('uri2', handler2)

app.use('rootUri', myRouter) 1
app.get('appUri1', handler3) 2
app.use(middleware2) 3
app.use('appUri2', handler4) 4
app.use(middleware3) 5
app.get('appUri1', handler5) 6

-----
routerApplicationRoutes = {
    {'get': {'uri': [handler1]},}
    [middleware1]
    {'get': {'uri2': [handler2]}}
    {'post': {'uri2': [handler2]}}
    {'put': {'uri2': [handler2]}}
    {'patch': {'uri2': [handler2]}}
    {'delete': {'uri2': [handler2]}}
}
1
applicationRouter = {
    {'get': {'rootUri/uri': [handler1]},}
    [middleware1]
    {'get': {'rootUri/uri2': [handler2]}}
    {'post': {'rootUri/uri2': [handler2]}}
    {'put': {'rootUri/uri2': [handler2]}}
    {'patch': {'rootUri/uri2': [handler2]}}
    {'delete': {'rootUri/uri2': [handler2]}}
}

2
applicationRouter = {
    {'get': {'rootUri/uri': [handler1]},}
    {'uri': 'rootUri', [middleware1]}
    {'get': {'rootUri/uri2': [handler2]}}
    {'post': {'rootUri/uri2': [handler2]}}
    {'put': {'rootUri/uri2': [handler2]}}
    {'patch': {'rootUri/uri2': [handler2]}}
    {'delete': {'rootUri/uri2': [handler2]}}
    {'get': {'uri': 'appUri': [handler]}}
}

3
applicationRouter = {
    {'get': {'rootUri/uri': [handler1]},}
    {'uri': 'rootUri', [middleware1]}
    {'get': {'rootUri/uri2': [handler2]}}
    {'post': {'rootUri/uri2': [handler2]}}
    {'put': {'rootUri/uri2': [handler2]}}
    {'patch': {'rootUri/uri2': [handler2]}}
    {'delete': {'rootUri/uri2': [handler2]}}
    {'get': {'uri': 'appUri': [handler]}}
    {[middleware2]}
}

4
applicationRouter = {
    {'get': {'rootUri/uri': [handler1]},}
    {'uri': 'rootUri', [middleware1]}
    {'get': {'rootUri/uri2': [handler2], routerUri: 'rootUri'}}
    {'post': {'rootUri/uri2': [handler2]}}
    {'put': {'rootUri/uri2': [handler2]}}
    {'patch': {'rootUri/uri2': [handler2]}}
    {'delete': {'rootUri/uri2': [handler2]}}
    {'get': {'uri': 'appUri': [handler]}}
    {'uri': '', [middleware2]}
    {'get': {uri: 'appUri2', [handler4]}}
    {'post': {uri: 'appUri2', [handler4]}}
    {'put': {uri: 'appUri2', [handler4]}}
    {'patch': {uri: 'appUri2', [handler4]}}
    {'delete': {uri: 'appUri2', [handler4]}}
    {'uri': '', [middleware3]}
}

5
applicationRouter = {
    {'get': {'rootUri/uri': [handler1]},}
    {'uri': 'rootUri', [middleware1]}
    {'get': {'rootUri/uri2': [handler2], routerUri: 'rootUri'}}
    {'post': {'rootUri/uri2': [handler2]}}
    {'put': {'rootUri/uri2': [handler2]}}
    {'patch': {'rootUri/uri2': [handler2]}}
    {'delete': {'rootUri/uri2': [handler2]}}
    {'get': {'uri': 'appUri': [handler]}}
    {'uri': '', [middleware2]}
    {'get': {uri: 'appUri2', [handler4]}}
    {'post': {uri: 'appUri2', [handler4]}}
    {'put': {uri: 'appUri2', [handler4]}}
    {'patch': {uri: 'appUri2', [handler4]}}
    {'delete': {uri: 'appUri2', [handler4]}}
    {'uri': '', [middleware3]}
}

6
applicationRouter = {
    {'get': {'rootUri/uri': [handler1]},}
    {'uri': 'rootUri', [middleware1]}
    {'get': {'rootUri/uri2': [handler2], routerUri: 'rootUri'}}
    {'post': {'rootUri/uri2': [handler2]}}
    {'put': {'rootUri/uri2': [handler2]}}
    {'patch': {'rootUri/uri2': [handler2]}}
    {'delete': {'rootUri/uri2': [handler2]}}
    {'get': {'uri': 'appUri': [handler5]}}
    {'uri': '', [middleware2]}
    {'get': {uri: 'appUri2', [handler4]}}
    {'post': {uri: 'appUri2', [handler4]}}
    {'put': {uri: 'appUri2', [handler4]}}
    {'patch': {uri: 'appUri2', [handler4]}}
    {'delete': {uri: 'appUri2', [handler4]}}
    {'uri': '', [middleware3]}
}

uri: '/rootUri/uri2', [GET] -> şartları sağladı
*/

/*
app.use çeşitleri
app.use(uri, handler)
app.use(uri, Router)
app.use(middleware)
----
app.applicationRoutes = []

app.use('/uri1', handler)

applicationRoutes = [
    {'get': {'/uri1', [handler]}},
    {'post': {'/uri1', [handler]}},
    {'put': {'/uri1', [handler]}},
    {'patch': {'/uri1', [handler]}},
    {'delete': {'/uri1', [handler]}}
]

app.use('/uri2', Router)

applicationRoutes = [
    {'get': {'/uri1', [handler]}},
    {'post': {'/uri1', [handler]}},
    {'put': {'/uri1', [handler]}},
    {'patch': {'/uri1', [handler]}},
    {'delete': {'/uri1', [handler]}},
    {'get': {'/uri2', Router}},
    {'post': {'/uri2', Router}},
    {'put': {'/uri2', Router}},
    {'patch': {'/uri2', Router}},
    {'delete': {'/uri2', Router}},
]

app.use(middleware);

applicationRoutes = [
    {'get': {'/uri1', [handler]}},
    {'post': {'/uri1', [handler]}},
    {'put': {'/uri1', [handler]}},
    {'patch': {'/uri1', [handler]}},
    {'delete': {'/uri1', [handler]}},
    {'get': {'/uri2', Router}},
    {'post': {'/uri2', Router}},
    {'put': {'/uri2', Router}},
    {'patch': {'/uri2', Router}},
    {'delete': {'/uri2', Router}},
    [middleware]
]

istek: /uri2/uri1 [GET]

const prefix = routes[i][get]?.uri
if (routes[i][get]?.router) {
    router = routes[i][get].router
}

router.route -> route.returnHandlers olarak değiştilecek
önceden handlers metotları execute ediyordu artıık sadece metotları dönecek
dönen metotlar app içinde handlers olarak adlandırılacak
route da yaptığım gibi found uri öncesindeki middleware'ler bulunup tutulacak
middleware olarak dizide tutulacaklar

[...middleware, ...handlers] olarak tek bir dizide tutulacaklar ve execute edilecekler.

*/