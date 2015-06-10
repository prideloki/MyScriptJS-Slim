<?php
require 'bootstrap.php';

$app = new \Slim\Slim(array(
    'view' => new \Slim\Views\Twig()
));

$view = $app->view();
$view->parserOptions = array(
    'debug' => true
);

$view->parserExtensions = array(
    new \Slim\Views\TwigExtension()
);

$app->add(new \Slim\Middleware\SessionCookie());

$app->post('/add',function() use($app){
    $inputs = $app->request->post();

    $v = new Valitron\Validator($inputs);
    $v->rules(array(
        'required'=>[['name'],['age']],
        'alpha'=>'name',
        'integer'=>'age'
    ));
    $v->rule('min','age',18);
    $v->rule('max','age',70);
    if($v->validate()){
        \App\Employee::create(array(
            'name'=>$inputs['name'],
            'age'=>$inputs['age']
        ));
        $app->flash('success','Successfully, Added '. $inputs['name'].'.');
    } else {
        $app->flash('errors',$v->errors());
    }

    $app->redirect('/add');
});

$app->get('/add',function() use($app,$view){
    $app->render('add_employee.twig');
});

$app->get('/',function() use($app){
    $employees = \App\Employee::all()->sortBy('created_at');
    $app->render('home.twig',array('employees'=>$employees));
});


$app->run();
