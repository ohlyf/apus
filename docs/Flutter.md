## 量的分类

### 不可变量

- `final`可以在`运行期间`赋值一次
- `const`始终不变

### 可变量

#### 基础类型

- `布尔bool`

- - true
  - false

- `数字num`

- - int
  - double

#### 聚合类型

- `字符串String`
- `列表List`
- `映射Map`
- `集合Set`



### 各种方法

#### 数字num的方法

```dart
num b=3.28;
b.abs();  // 绝对值
b.ceil();  // 向上取整
b.floot();  // 向下取整
b.round();  // 四舍五入
b.truncate();  // 去除小数部分，取整
String v=b.toStringAsFixed(1);  // 四舍五入，保留几位小数，返回字符串

// parse方法
double result=double.parse('3.3');
int result=int.parse('10');
int value = int.parse('7e6',radix: 16);
print(value); // 2022

// 转换进制
int a=2022;
print(a.toRadixString(2));//11111100110
print(a.toRadixString(16));//7e6
```

#### 字符串方法

```dart
String name='toly199');
print(name[4]);  // 1
print(name[name.length-1]);  // 9
print(name.substring(4,name.length-1)); //19

String name = '  toly 1994 ';
name.trim();//toly空1994
name.trimLeft(); //toly空1994空 
name.trimRight();//空空toly空1994

String name = 'tolY1994 ';
name.toUpperCase();//TOLY1994
name.toLowerCase(); //toly1994 

String name = 'toly1994';
name.startsWith('T'); // 以XXX开始
name.endsWith('4');  // 以XXX结尾
name.contains('99'); // 包含XXX

String name='toly 1999';
name.replaceAll(' ' ,'_'); // toly_1999
name.split(' ');   // [toly,1999]
 
```



#### List方法

```dart
List<String> cnNum=['零', '壹', '贰', '叁', '肆', '伍', '六', '柒', '捌', '玖'];
cnNum.add('拾');
cnNum.add('佰');
cnNum.addAll(['仟', '萬', '亿']);
cnNum.insert(2, '点');
cnNum.insertAll(2, ['横', '撇']);

// 删除
cnNum.removeAt(2);
cnNum.remove('佰');

// 改
cnNum[1]='六';

// 查
print(cnNum[1])
```

#### Set方法

```dart
Set<String> cnNum = {'零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'};

// 增
cnNum.add('玖'); // 无改变，不允许有相同的元素

// 删
cnNum.remove('零');  

// 入参是可叠代对象就行
cnNumUnits.addAll({'零', '元','角','分'});
cnNumUnits.addAll(['拾', '佰', '仟', '萬', '亿']);
cnNumUnits.removeAll({'元','角','分'});

// 交集 并集  补集
Set<String> cnNumUnits = {'零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'};
Set<String> part = {'零', '壹', '贰', '元', '角', '分'};

// 交集
cnNumUnits.intersection(part);

// 并集
cnNumUnits.union(part);

// 补集
cnNumUnits.difference(part);
```

#### Map映射方法

```dart
Map<String,String> dict={
  'about':'关于',
  'boot':'启动',
  'card':'卡片',
}

// 访问
print(dict['card']);

// 修改
dict['boot']='启动，靴子';

// 增加
dict['dog']='狗';
dict['cat']='猫';

// 通过key删除元素
dict.remove('cat');
```

#### 三种聚合类型的关系

```dart
// List Set互相转化
List<String> cnNum=['零', '壹', '贰', '叁','贰', '贰'];
Set<String>cnNumSet=cnNum.toSet();

List<String> cnNumUnique=cnNumSet.toList();

// List转Map
List<String> cnNumUnits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
Map<int,String> cnNumMap=cnNumUnits.asMao();
print(cnNumMap);
// {0: 零, 1: 壹, 2: 贰, 3: 叁, 4: 肆, 5: 伍, 6: 陆, 7: 柒, 8: 捌, 9: 玖}

// 根据两个可迭代对象创建Map
List<String> cnNumUnits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖','拾','佰','仟','萬'];
Set<int> numUnitsSet = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,100,1000,10000};
Map<int,String>map=Map.fromIterables(numUnitSet,cnNumUnits);
print(map);
// {0: 零, 1: 壹, 2: 贰, 3: 叁, 4: 肆, 5: 伍, 6: 陆, 7: 柒, 8: 捌, 9: 玖, 10: 拾, 100: 佰, 1000: 仟, 10000: 萬}

// Map获取可迭代对象 
Map<String,String> dict = {'about': '关于', 'boot': '启动', 'card': '卡片'};
dict.keys.toList();
dict.valued.toList();

dict.keys.toSet();
dict.values.toSet();
```

## 函数

### 传参方式

#### 普通传参

```dart
void solution(int n,int m){
  print('头数:$n 足数$m');
  int y=n+m;
}
```

#### 命名参数

##### 好处：

- 使`语义更加准确`，通过`{}`设为命名参数
- 调用时参数可以不按顺序传递

```dart
void solution({
  required int head,
  required int foot,
  int age=19
}){
  print('头数$head,足数$foot');
}

// 调用
solution(head:85,foot:194)
```



#### 位置参数

###### 特点：

- 传参方式:`[参数1，参数2...]`
- 必须`按顺序`一次进行传参，一般用于参数有前后顺序的场景

```dart
DateTime(int year,[int month=1,int day=1,int hour=0,int minute=0,int second=0,int millisecond=0,int microsecond=0])
```



### 函数类型

通过`typedef`定义类型，如下表示入参是`double`，返回值是`double`的函数

```dart
typedef Operation=double Function(double)
```

#### 函数对象的声明和使用

使用函数类型的实例来指代`square`函数，可以直接使用`op`来进行函数调用

```dart
main(){
  Operation op=square;
}

double square(double a){
  return a*a;
}

op(10);
```

#### 函数类型方法入参

```dart
double add(double a,double b,{Operation? op}){
  if(op==null)return a+b;
  return op(a)+op(b);
}

double result=add(3,4,op:(double a)=>a*a*a);
print(result)
```



## 流程控制

- `if...else`
- `if...else if....else`
- `switch`
- `for(startExp;condition;eachLoopExp){}`
- `for(String item in cn){}`   只对List生效
- `while`
- `do...while`

### 自定义报错

- `e`：可以看出异常的信息
- `s`：可以看出发生错误时方法栈的情况

```dart
void main(){
  try{
    getMean('about');
  }catch(e,s){
    print("${e.runtimeType}:${e.toString()}");
  }
}

String getMean(String arg){
  Map<String,String> dict={'card':'卡片','but':'但是'};
  String? result=dict[arg];

  if(result==null){
    throw Exception('empty $arg mean in dict');
  }
  return result;
}

// 拓展报错
class NoElementInDictException implements Exception{
  final String arg;

  NoElementInDictException(this.arg);

  @override
  String toString()=>'empty $arg mean in dict';
}

// 明确捕获哪种异常
void main(){
  try{
    getMean('about');
  }on NoElementInDictException catch(e,s){
    // 特定种类的异常处理
  }catch(e,s){
    // 其余异常处理
  }
}

// finally关键字
// 无论异常与否都会执行
void foo2(){
  try {
    getMean("about");
  } catch (e,s) {
    print("${e.runtimeType}: ${e.toString()}");
    print("${s.runtimeType}: ${s.toString()}");
  } finally{
    print("finally bloc call");
  }
```



## 类

### get和set关键字

`get`和`set`关键字修饰的是`成员方法`，本质上是一种简写方式，通过`get`关键字声明的成员方法，在调用时不加`()`，下面tag1和tag2等级

```dart
class Vec{
  double getLength()=>math.sqrt(x*x+y*y);  // tag1
  double get length=>math.sqrt(x*x+y*y);  // tag2
}

// 使用
Vec p=Vec(4,3);
print(p.length)  // 5.0
```

`set`也是类似，可以像对属性赋值一样触发方法，比如下面：

```dart
class Vec{
  double x;
  doubble y;
  String? _name;
  Vec(this.x,this.y);

  String getInfo() => "${name}Vec2($x,$y)";

  double get length => math.sqrt(x * x + y * y);
	String get name => _name ?? "";

  set name(String? value){
    if(value==null){
      _name='';
    }else{
      _name=value+": ";
    }
  }
}
```

当`p`对象为`name`赋值时，就会触发`set`方法中的逻辑，且等号后的值作为方法入参，在方法中，根据`value`入参为`_name`成员属性赋值

```dart
Vec p=Vec(4,3);
print(p.length);
p.name='p0';
print(p.getInfo());  // P0: Vec2(4.0,3.0)
```



#### 可选构造入参

```dart
class Vec{
  double x;
  double y;
  String? _name;

  Vec(this.x,this.y,{String? name}):_name=name;
}

// 使用
Vec p=Vec(4,3);
Vec p=Vec(4,3,name:'p');
```

#### 命名构造

因为`Dart`不支持函数重载，所以有了更优雅的方式`命名构造`，就是不同的需求初始化可以定义不同的构造函数

```dart
class Vec{
  Vec.polar(double length,double rad):
  x=length*math.cos(rad),
  y=length*matn.sin(rad);

  Vec.person(String name,int age):
  this.name=name,
  this.age=age;
}

// 使用
Vec p=Vec.polar(10,math.pi/4);
print(p.getInfo);
```



#### 其他

```dart
// 类中的不可变成员，尽量使用`final` 修饰
class Person{
  final String name;
}

// 类中的静态成员，一般表示一类公共特征
class Person{
  String name;
  static String nation='';

  Person(this.name);

  static void printNation(){
   print("现在朝代是: $nation");
 }

  void say(){
    print('我叫$name,我是$nation人');
  }
}

// 使用

Person.nation='唐朝';
print(Person.nation);
```

#### 函数可见性

对于类本身来说，如果另一个文件中的类，其名称以`_`开头，可无法访问该类，所以可见性的单位是`文件`，同一个文件中并没有可见性的区分，也就是说在使用同一个文件中的类时，以`_`开头的`类`、`成员方法`、`成员变量`的访问不受限制





### 面向对象三大特性

#### 继承

- `继承自抽象类，派生类必须实现其中的抽象方法`

```dart
abstract class Shape{
  Vec center;

  Shape(this.center);

  void move(){
    center.x+=10;
    center.y+=10;
  }

  void draw(){
    String info="绘制矩形，中心点(${center.x},${center.y}),${drawInChild}";
  }

  String drawInChild();

  void rotate(){}
}

class Rectangle extends Shape{
  double widthl;
  double height;

  Rectangle(Vec center,{this.width=10,this.height=10}):super(center);

  @override
  String drawInChild()=>"宽:${height},高${width}"
  }
```

#### 多态

多态在`屏蔽派生类对象之间差异性`的同时，也会`屏蔽掉派生类各自的特点`，在`tag`处，将`Rectangle`对象声明为`Shape`对象，那么你就无法访问到矩形的宽高，同样在`drawShape`中，入参是`Shape`对象，在方法体中无法访问派生类中定义的额外成员

```dart
Shape rectangle = Rectangle(Vev(10,10));

void drawShape(Shape shape){
  shape.draw();
}
```

如果想通过基类对象访问派生类的成员，也有途径，可以通过`is`关键字来校验是否是`Rectangle`，在执行相关代码：

```dart
void drawShape(Shape shape){
  shape.draw();
  if(shape is Rectangle){
    print('绘制矩形：宽高${shape.width});
	}
}
}
```

封装是继承的基础、继承是多态的前提、多态丰富封装的内容，三者不是互相独立的，而是彼此依存，共同作用的



### 继承(extends)、实现(implements)、混入(with)

将派生类对象视为基类对象，这一点对于`extend`、`implements`、`with`三种关系都适用，可以通过`is`关键字来校验一个对象是否是某个类型

```dart
void main(){
  Rectangle rectangle=Rectangle(Vec(10,10));
  print(rectangle is Shape);
}
```

通过`as`关键字强制转换

```dart
void main(){
  Shape circle=Circle(Vec(10,10));
  Circle c=circle as Circle;
  print(c.circle);
}
```

### 泛型

```dart
class AClass<T>{
  final T memberT;
  AClass(this.memberT);
	
  void printType(){
    print('当前对象类型:${memberT.runtimeType}");
}

T getMemberT()=>memberT;
}

void main(){
	AClass<Egg> eggType=AClass(Egg());
	AClass<int> intType=AClass(10);
	eggType.printType();  
	intType.printType();
}
```

#### 类的泛型

可以多个，但是一般不超过两个，在`<>`内通过`,`隔开，都能被用到

```dart
class BClass<T,V>{
  final T memberT;
  final V memberV;
  BClass(this.memberT,this.memberV);

  void printType(){
    print("当前对象类型T:${memberT.runtimeType}"
        "当前对象类型V:${memberV.runtimeType}");
  }

  T getMemberT() => memberT;
  V getMemberV() => memberV;
}
```

#### 函数/方法的泛型

方法名后加`<>`，泛型类型可以作为入参类型、返回值类型，如下，支持`k,v`两个泛型，第一个入参是`K`类型，返回`V`类型对象，再使用时是`find<int,string>`

```dart
V? find<K,V>(K k,Map<K,V> map){
  return map[k];
}

void main(){
  Map<int,String> map={1:'one'}
  String? info=find<int,String>(1,map);
}
```

#### 限定泛型

泛型提供一种在定义时的`未定类型`，在使用时的`指定类型`的机制，由于使用时类型未定，只能调用`runtimeType`和`toString`等任何类型都存在的方法，那么怎么限定泛型，使之能使用某些方法呢？只需要使用`extends`关键字，来指定`CClass`的类型，由于这里`T`必然是`Shape`及其衍生类，所以在类中使用`T`类型时，可以访问`Shape`类的成员：

```dart
class CClass<T extends Shape>{
  final T memberT;
  CClass(this.memberT);

  void main(){
    CClass<Circle> obj=CClass(Circle<Vec(0,2)));
  }
```



### 空安全

空安全之前在`编译期间`是没有问题的，但在`运行时`由于`name`是`null`，而`null`没有`.length`方法，所以会抛异常

```dart
void main(){
  String name=null;
  say(name);
}

void say(String name){
  print("我的名字是${name}");
}
```

这就导致，在一个方法中，我们并不能确定某个变量是否为空，这就会带来`null引起的安全隐患`，空安全之前，消除隐患的唯一途径就是为每个量都校验一下是否为空，再做处理，这无疑是非常耗费时间、耗费代码的，大量判空的逻辑会造成代码可读性的降低。



我们需要一种语法特性，让我们在代码编写的过程中，能够放心地，知道某个量一定不是`null`，这个特性就是`空安全`，也就是说，使用空安全，可以将运行时的空问题提前暴露，在`代码编写的过程`中进行规避。

空安全的本质变化是null从Object类族中脱离，自成一排，就是不能讲一个普通类型对象赋值为null



`null`在编程中如果一定要用，就可以在类型后加`?`表示该类型可空，该类型已经不再是`Object`了，表示可空类型`Null`已经独立于`Object`之外了

```dart
void main(){
  String? name=null;
  print(name is Object);  // false
  print(name is String);  //false
  print(name is Null);   // true
}
```

#### late

因为引入了空安全，所以一个基本类型必须进行初始化，但是又不想初始化就可以使用`late`表示，一个承诺，后面一定给他赋值

```dart
class Person{
  late String name;

  void say(){
    this.name='哈哈';
    print(name);
  }
}
```



#### !

承诺的事`在此时该可用变量一定不为空`

```dart
String? name=null;
say(name!);

void say(String name){
  print('我的名字是$name');
}
```



### 类定义相关语法特性

#### 类的运算符重载

如果想让两个`Vec`相加，获得一个新的`Vec`对象，可以使用运算符重载，如下使用`operator`关键字加上`运算符`作为方法名即可，加法时二元运算符，所以方法中有一个入参，该入参类型就是使用时`+`后面的对象类型：

```dart
void main() {
  Vec2 p0 = Vec2(3, 4);
  Vec2 p1 = Vec2(2, 5);
  Vec2 p2 = p0.add(p1);
  Vec2 p2 = p0 + p1 + p0 + p1; 
  print(p2); //Vec2(5.0,9.0)
}

class Vec{
  final double x;
  final double y;

  Vec(this.x,thix.y);

  Vec operator +(Vec other)=>Vec(other.x+x,other.y+y);

  @override
  String toString()=>'Vec($x,$y)'
}
```

#### 类的扩展方法

关键字`extension`，该特性支持在某类定义文件之外，扩展该类的方法，在其中可以访问类成员，这对一些三方库或者框架内不便修改的类扩展功能是非常有益的



比如下面为`String`扩展`isPhone`的方法来校验字符串是不是手机号，如下`isPhone`就相当于`String`中的一个成员方法，可以访问`this`对象

```dart
extension JudgeStringExt on String{

  bool isPhone(){
    const String reg = r'^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$';
    RegExp(reg).hasMatch(this);
    return RegExp(reg).hasMatch(this);
  }
}
```

这样`isPhone`就可以直接被当作成员函数被调用

```dart
void main() {
  String input = "18715079839";
  bool checked = input.isPhone();
  print(checked); // true
}
```



`运算符`本身也是一种方法，所以支持扩展，如下对`>`的扩展，用于判断配个`String`首位字符的大小

```dart
bool operator >(String other){
  int thisCode=0;
  int otherCode=0;
  if(isNotEmpty){
    thisCode=codeUnits.first;
  }
  if(other.isNotEmpty){
    otherCode=other.codeUnits.first;
  }
  return thisCode>otherCode;
}

// 使用
print("hello">"toly")  // false
```

扩展方法只能扩展 成员方法， 不支持扩展 普通成员变量， 而且不能在扩展原类中已存在的方法，当扩展中定义静态成员变量、静态成员方法时，只归扩展累所属，无法扩展到目标类



## 几个符号

- `??`表示为`null`时取值  `a=arg??'unknown'`
- `..`表示当前对象，可以继续访问类成员和方法

```dart
// 之前
void main(){
  Person toly=Person();
  toly.name='toly';
  toly.age=29;
  toly.log();
}

class Person {
  String name = '';
  int age = 0;

  void log(){
    print("name:$name,age:$age");
  }
}

// 之后简写
void main(){
  Person toly=Person();
  toly..name='toly'..age=29..log();
}
```

### 枚举

```dart
enum GanderType{
  male,
  female,
  secrecy,
}
```

使用通过`枚举名.元素`，可以通过`values`获取某个枚举的所有元素在一起的列表

```dart
void main(){
  GanderType type=GanderType.male;
  List<GanderType> li=GanderType.values;
}
```

### runtimeType 查看运行时类型

```dart
main() {
  var addFun = (int a, int b){
    return a + b;
  };
  print(addFun.runtimeType); // (int, int) => int
  print(addFun(10,20)); // 30
}
```

### typedef定义函数类型

```dart
typedef OperationFun = int Function(int a,int b);

main() {
  OperationFun addFun = (int a, int b){
    return a + b;
  };
  
  print(addFun.runtimeType);
  print(addFun(10,20));
}
```



### future 异步  stream流 





## 文件管理

### import

```dart
import '../vec/vec2.dart'; // 相对路径
import 'package:idream/grammar/package/01/vec/vec2.dart'; // 项目中绝对路径
```

### as

引入的文件具有相同类名冲突时

```dart
import 'conflict1.dart';
import 'conflict2.dart' as c2;

void main(){
  Conflict conflict1 = Conflict("Conflict1");
  c2.Conflict conflict2 = c2.Conflict("Conflict2");
}
```

### show 与 hide

文件内容的显示隐藏，如下引入的时候使用了show，就只能使用这两个，如果只有个别内容需要显示就用`show`，如果只有个别内容不能访问就用`hide`

```dart
// 1.dart
const String name='alien';
const int age =18;

void say(){
  print('in say');
}

void play(){
  print('play');
}

// 2.dart
import './1.dart' show age,play;
```

### 部分与整体：part of 与 part

`part of`是一种将部分代码分离到另一个文件中的手段，但逻辑上该文件仍属于宿主文件，如下：宿主文件时`human.dart`，其中通过`part`关键字表示指定文件是当前文件的一部分，另一部分的文件中使用`part of`关键字表示归属关系

![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131350929.png)

注意：`part`文件中不允许提供`import`关键字，但在宿主类中导入的包，都可以在`part`文件中使用

![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131401338.png)



### 定义库与导出： library 与 export

如果一个体系中有非常多的类，那么使用时一个一个导入非常麻烦，这时可以定义库，只要引入一个库文件，就可以使用其中的所有可访问的内容，比如下面所示给一个`human_lib.dart`的文件作为库，使用`library`关键字定义库名，`export`关键字导出相关文件

![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131350362.png)使用：

```dart
import 'human/human_lib.dart';

void main(){
  Body body = Body();
  Head head = Head();
  Human human = Human();
}
```



## 紧约束

### 什么是紧约束

`紧约束`一词来自于`BoxConstrains`类中的`tight`构造，我们知道，通过`BoxConstraints`约束可以设置宽高的取值区间，如下所示，在`tight`构造中，最小和最大宽都是`size,width`，最小和最大高都是`size.height`，这说明在该约束下，被约束者的`尺寸`只有一种取值可能

```dart
BoxConstrants.tight(Size size):
	minWidth=size.width,
	maxWidth=size.width,
	minHieight=size.height,
	maxHeight=size.height
```

#### 最简单紧约束

默认占据全屏，即使用`SizedBox`设置也不行，在父级是`紧约束`的条件下，`SizedBox`无法对子级的尺寸进行修改

```dart
void main() {
  runApp(
    const SizedBox(
      width: 100,
      height: 100,
      child: ColoredBox(color: Colors.blue),
    ),
  );
}
```

![img](https://raw.githubusercontent.com/ohlyf/img-url/master/202301131350487.png)

### 如何打破原有紧约束

#### 方式一

通过`UnconstrainedBox`解除约束，让自身约束变为无约束

```dart
void main() {
  runApp(
    const UnconstrainedBox(
      child: SizedBox(
        width: 100,
        height: 100,
        child: ColoredBox(color: Colors.blue),
      )
    )
  );
}
```

#### 方式二

通过`Align`、`Flex`等组件`放松约束`，让自身约束变为`送约束` 

当前宽度0->maxWidth，当前高度0->maxHeight

```dart
void main() {
  runApp(
    const Align(
      alignment: Alignment.topLeft,
      child: ColoredBox(color: Colors.blue),
    ),
  );
}
```

#### 方式三

通过`CustomSingleChildLayout`等自定义布局组件施加`新约束`

如下自定义`DiyLayoutDelegate`通过覆写`getConstraintsForChild`方法可以随意修改子级的约束

还有`CustomMultiChildLayout`是对多个子级施加约束

```dart
void main() {
  runApp(
    CustomSingleChildLayout(
      delegate: DiyLayoutDelegate(),
      child: const ColoredBox(color: Colors.blue),
    ),
  );
}

class DiyLayoutDelegate extends SingleChildLayoutDelegate {
  
  @override
  bool shouldRelayout(covariant SingleChildLayoutDelegate oldDelegate) => false;

  @override
  BoxConstraints getConstraintsForChild(BoxConstraints constraints) {
    return BoxConstraints.tight(const Size(100, 100));// tag1
  }
}
```

## MaterialApp

### MaterialApp下约束信息

- 集成`AnimatedTheme`、`Theme`、`Localizations`组件处理应用主题和语言
- 集成`ScrollConfiguration`、`Directionality`、`PageStorage`、`PrimaryScrollController`、`MediaQuery`等`InheritedWidget`组件为子级节点提供全局信息
- 集成`Navigator`与`Router`组件处理路由跳转
- 集成`WidgetInspector`、`PerformanceOverlay`等调试信息组件
- 集成`Shortcuts`与`Actions`等组件处理桌面端快捷键



### Scaffold下的约束信息

- 集成头部栏`appBar`
- 集成底部栏`bottomNavigationBar`
- 左滑页`drawer`
- 右滑页`endDrawer`
- 底滑页`bottomSheet`
- 浮动按钮`floatingActionButton`
- 内容体`body`等



### Flex、Wrap、Stack组件下的约束

#### Flex

1. 默认情况下，Flex施加约束的特点：在`主轴`方向上`无限约束`，在`交叉轴`方向上`放松约束`
2. Flex的children列表中的组件，所受到的约束都是一样的

#### Wrap

1. 默认情况下，Wrap施加的约束的特点：在`主轴`方向上`放松约束`，在`交叉轴`方向上`无限约束`
2. Wrap的children列表中的组件，所受到的约束都是一致的

#### Stack

Stack施加约束的特点：

1. loose下，宽高尽可能放松约束
2. expand下，施加`强约束`，约束尺寸为自身受到约束的`最大尺寸`
3. `passthrough`下，仅`传递约束`，把自身受到的约束原封不动的施加给子级
4. `Stack`的children列表中的组件，所受到的约束都是一致的

```dart
Stack(
  fit: StackFit.passthrough,)
```