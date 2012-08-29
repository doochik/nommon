var no;
if (typeof window === 'undefined') {
    no = module.exports = require('./no.js');
} else {
    no = no || {};
}

//  ---------------------------------------------------------------------------------------------------------------  //

//  Простейший pub/sub
//  ------------------
//
//  `no.Events` -- объект, который можно подмиксовать к любому другому объекту:
//
//      var foo = {};
//      no.extend(foo, no.Events);
//
//      foo.on('bar', function(e, data) {
//          console.log(e, data);
//      });
//
//      foo.trigger('bar', 42);
//
//  Или же:
//
//      function Foo() {}
//
//      no.extend(Foo.prototype, no.Events);
//
//      var foo = new Foo();
//
//      foo.on('bar', function(e, data) {
//          console.log(e, data);
//      });
//
//      foo.trigger('bar', 42);
//

//  ---------------------------------------------------------------------------------------------------------------  //

no.Events = {};

//  ---------------------------------------------------------------------------------------------------------------  //

//  Возвращает список обработчиков события name.
//  Если еще ни одного обработчика не забинжено, возвращает (и сохраняет) пустой список.
//
no.Events._getEventHandlers = function(name) {
    var handlers = this._eventHandlers || (( this._eventHandlers = {} ));

    return handlers[name] || (( handlers[name] = [] ));
};

//  ---------------------------------------------------------------------------------------------------------------  //

//  Подписываем обработчик handler на событие name.
//
no.Events.on = function(name, handler) {
    var handlers = this._getEventHandlers(name);

    handlers.push(handler);
};

//  Отписываем обработчик handler от события name.
//  Если не передать handler, то удалятся вообще все обработчики события name.
//
no.Events.off = function(name, handler) {
    if (handler) {
        var handlers = this._getEventHandlers(name);
        //  Ищем этот хэндлер среди уже забинженных обработчиков этого события.
        var i = handlers.indexOf(handler);

        if (i !== -1) {
            //  Нашли и удаляем этот обработчик.
            handlers.splice(i, 1);
        }
    } else {
        var handlers = this._eventHandlers;
        if (handlers) {
            //  Удаляем всех обработчиков этого события.
            delete handlers[name];
        }
    }
};

//  ---------------------------------------------------------------------------------------------------------------  //

//  "Генерим" событие name. Т.е. вызываем по-очереди (в порядке подписки) все обработчики события name.
//  В каждый передаем name и params.
//
no.Events.trigger = function(name, params) {
    //  Копируем список хэндлеров.
    //  Если вдруг внутри какого-то обработчика будет вызван `off()`,
    //  то мы не потеряем вызов следующего обработчика.
    var handlers = this._getEventHandlers(name).slice();

    for (var i = 0, l = handlers.length; i < l; i++) {
        handlers[i].call(this, name, params);
    }
};

//  ---------------------------------------------------------------------------------------------------------------  //
