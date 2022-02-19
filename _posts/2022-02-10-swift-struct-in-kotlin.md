---
layout: post
title:  "Swift Struct equivalent in Kotlin"
image: ''
date:   2022-02-10 00:06:31
tags:
- Swift, Kotlin
description: 'Android'
categories:
- Koltlin
series: learn
---


# What is the best possible equivalent of Swift Struct in Kotlin? 

Until recently I have used data class in Kotlin whenever I need to convert a Swift struct into a Kotlin equivalent in Android project. It works fine but it is not a perfect solution. Both struct and data class are simplified versions of a class. Data class is still a class. It is a reference type. On the other hand, struct is a value type. 

Let’s have a look at some examples. First an example of Swift struct:
```
struct Person {
   let name: String
   var age: Int
}

let person1 = Person (name: "Alex", age: 20)

var person2 = person1
person2.age = 30

print(person1.age) // Prints 20
print(person2.age) // Prints 30
```

The results are different because copying a struct creates an independent instance with its own unique copy of its data. 

Before using Data class, let’s have a look what if we use class instead. 
```
class Person(name: String) {
    var age: Int? = null
}
val person1 = Person("Alex")
person1.age = 20

var person2 = person1
person2.age = 30

println("Person1 age: ${person1.age?.toString()}") // Person1 age: 30
println("Person2 age: ${person2.age?.toString()}") // Person2 age: 30
```
Both Person1 and Person2 now displaying same age! This is happening because when you assign in Kotlin, you are copying a reference, not a class. The variable person2 here pointing to the exact same object that person1 is pointing to.

What about Data class? 
```
data class Person(var name: String, var age: Int)

val person1 = Person("Alex", 20)
var person2 = person1.copy()
person2.age = 30

println("Person1 age: ${person1.age.toString()}") // Person1 age: 20
println("Person2 age: ${person2.age.toString()}") // Person2 age: 30
```
Data class is indeed displaying the expected result! We use data class to create immutable objects. If we need to overwrite existing field values in one of our immutable objects, we use the data class's “copy” function to set a new value for the desired field while preserving the rest of the values. In fact, Swift's struct isn't quite as convenient as Kotlin's data class because Swift's struct doesn't have a similar “copy” function. To adopt this immutability pattern in Swift, you'll have to write quite a lot of boilerplate code.

But there is a downside of using data class. Instantiating a data class is expensive. Primitive values can be written to the stack which is fast and efficient. Instances of data classes are written to the heap.

Are there any other options? There is another option which is Inline class (available since Kotlin 1.3). It was introduced to overcome the shortcomings of traditional wrappers around some types. Inline class add the goodness of Type Aliases with the value range of the primitive data types which improve performance. This happens because the data is inlined into its usages, and object instantiation is skipped in the resulting compiled code. But inline class is limited to one parameter in its constructor at the moment. So, we have no choice but to use data class to wrap multiple parameters for the time being.


![bye](/assets/img/gifs/bye.gif)
