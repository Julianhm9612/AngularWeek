var observable = Rx.Observable.create(function (observer) {
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.completed(); 
  });
  observable.subscribe(
    value => console.log(value),
    err => console.log(err),
    () => console.log('this is the end')
  );