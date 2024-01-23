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