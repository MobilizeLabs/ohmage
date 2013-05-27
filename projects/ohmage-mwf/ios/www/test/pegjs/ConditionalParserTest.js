if(!fixture){
    var fixture = {};
}

module( "pegjs.ConditionalParser", {
  setup: function() {
      fixture.data = {
          'prompt1' : 'response1',
          'prompt2' : 'response2',
          'prompt3' : 'response3',
          'prompt4' : 'response4',

          'number1' : 1,
          'number2' : 2

      };
      
      fixture.complexData = {};
      fixture.complexCondition = "((Sexacts == 1) and (Sexcasual > 1)) or ((Sexacts == 2) and (Sexcasual > 2)) or ((Sexacts == 3) and (Sexcasual > 3)) or ((Sexacts == 4) and (Sexcasual > 4)) or ((Sexacts == 5) and (Sexcasual > 5))";// or ((Sexacts == 6) and (Sexcasual > 6));// or ((Sexacts == 7) and (Sexcasual > 7)) or ((Sexacts == 8) and (Sexcasual > 8)) or ((Sexacts == 9) and (Sexcasual > 9)) or ((Sexacts == 10) and (Sexcasual > 10)) or ((Sexacts == 11) and (Sexcasual > 11)) or ((Sexacts == 12) and (Sexcasual > 12)) or ((Sexacts == 13) and (Sexcasual > 13)) or ((Sexacts == 14) and (Sexcasual > 14)) or ((Sexacts == 15) and (Sexcasual > 15)) or ((Sexacts == 16) and (Sexcasual > 16)) or ((Sexacts == 17) and (Sexcasual > 17)) or ((Sexacts == 18) and (Sexcasual > 18)) or ((Sexacts == 19) and (Sexcasual > 19)) or ((Sexacts == 20) and (Sexcasual > 20)) or ((Sexacts == 21) and (Sexcasual > 21)) or ((Sexacts == 22) and (Sexcasual > 22)) or ((Sexacts == 23) and (Sexcasual > 23)) or ((Sexacts == 24) and (Sexcasual > 24)) or ((Sexacts == 25) and (Sexcasual > 25)) or ((Sexacts == 26) and (Sexcasual > 26)) or ((Sexacts == 27) and (Sexcasual > 27)) or ((Sexacts == 28) and (Sexcasual > 28)) or ((Sexacts == 29) and (Sexcasual > 29)) or ((Sexacts == 30) and (Sexcasual > 30)) or ((Sexacts == 31) and (Sexcasual > 31)) or ((Sexacts == 32) and (Sexcasual > 32)) or ((Sexacts == 33) and (Sexcasual > 33)) or ((Sexacts == 34) and (Sexcasual > 34)) or ((Sexacts == 35) and (Sexcasual > 35)) or ((Sexacts == 36) and (Sexcasual > 36)) or ((Sexacts == 37) and (Sexcasual > 37)) or ((Sexacts == 38) and (Sexcasual > 38)) or ((Sexacts == 39) and (Sexcasual > 39)) or ((Sexacts == 40) and (Sexcasual > 40)) or ((Sexacts == 41) and (Sexcasual > 41)) or ((Sexacts == 42) and (Sexcasual > 42)) or ((Sexacts == 43) and (Sexcasual > 43)) or ((Sexacts == 44) and (Sexcasual > 44)) or ((Sexacts == 45) and (Sexcasual > 45)) or ((Sexacts == 46) and (Sexcasual > 46)) or ((Sexacts == 47) and (Sexcasual > 47)) or ((Sexacts == 48) and (Sexcasual > 48)) or ((Sexacts == 49) and (Sexcasual > 49)) or ((Sexacts == 50) and (Sexcasual > 50))";
      
  },
  teardown: function() {
      delete fixture.data;
      delete fixture.complexData;
      delete fixture.complexCondition;
  }
});

test( "Test complex conditional statement with empty data set.", function() {
   
   ///
   var result = ConditionalParser.parse( fixture.complexCondition, { Sexacts : 1, Sexcasual : 3} );
   ///
   
   ok (!result);
   
});


test( "Test a == a, with text : true", function() {

    var condition = "prompt1 == response1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "Equal values should result to true with == condition." );
});

test( "Test a == a, with numbers : true", function() {

    var condition = "number1 == 1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "Equal values should result to true with == condition." );
});

test( "Test a == b : false", function() {

    var condition = "prompt1 == response2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(!result, "Unequal values should result to false with == condition." );
});

test( "Test a != b : true", function() {

    var condition = "prompt1 != response2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "Unequal values should result to true with != condition." );
});

test( "Test a != a : false", function() {

    var condition = "prompt1 != response1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(!result, "Equal values should result to false with != condition." );
});

test( "Test 2 > 1 : true", function() {

    var condition = "number2 > 1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "2 is greater than 1." );
});

test( "Test 2 >= 1 : true", function() {

    var condition = "number2 >= 1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "2 is greater than or equal to 1." );
});

test( "Test 2 < 1 : false", function() {

    var condition = "number2 < 1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(!result, "2 is not less than 1." );
});

test( "Test 2 > 1 : true", function() {

    var condition = "number2 > 1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "2 is greater than 1." );
});

test( "Test 1 <= 2 : true", function() {

    var condition = "number1 <= 2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "1 is less than or equal to 2." );
});

test( "Test a == a and b == b : true", function() {

    var condition = "prompt1 == response1 and prompt2 == response2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "AND of two truthful expressions should be true." );
});

test( "Test a == b and b == b : false", function() {

    var condition = "prompt1 == response2 and prompt2 == response2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(!result, "AND of at least one false expression should be false." );
});

test( "Test a == a and a != b : false", function() {

    var condition = "prompt1 == response1 and prompt1 != response2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "AND of true expressions should be true." );
});

test( "Test a == b and b == c : true", function() {

    var condition = "prompt1 == response2 and prompt2 == response3";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(!result, "AND of two false expressions should be false." );
});

test( "Test a == a and b == b and c == c : true", function() {

    var condition = "prompt2 == response2 and prompt2 == response2 and number1 == 1";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "AND of three truthful expressions should be true." );
});

test( "Test a == a or b == b : true", function() {

    var condition = "prompt1 == response1 or prompt2 == response2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "OR of two truthful expressions should be true." );
});

test( "Test a == b or b == b : true", function() {

    var condition = "prompt1 == response2 or prompt2 == response2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "OR of at least one true expression should be true." );
});

test( "Test a != b or b == b : true", function() {

    var condition = "prompt1 != response2 or prompt2 == response2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "OR of at least one true expression should be true." );
});

test( "Test a == b or b != b : false", function() {

    var condition = "prompt1 == response2 or prompt2 != response2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(!result, "OR of two false expressions should be false." );
});

test( "Test a != a or b == b : true", function() {

    var condition = "prompt1 != response1 or prompt2 == response2";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "OR of at least one true expression should be true." );
});

test( "Test a == b or b == c : false", function() {

    var condition = "prompt1 == response2 or prompt2 == response3";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(!result, "OR of two false expressions should be false." );
});

test( "Test a == a and b == b or c == d : true", function() {

    var condition = "prompt1 == response1 and prompt2 == response2 or prompt3 == prompt4";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "The left and should be evaluated first." );
});

test( "Test a == b and b == b or c == d : false", function() {

    var condition = "prompt1 == response2 and prompt2 == response2 or prompt3 == prompt4";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(!result, "The left and should be evaluated first." );
});

test( "Test (a == a) : true", function() {

    var condition = "(prompt1 == response1)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "Equal values should be matched." );
});

test( "Test (a == a) and (b == b) : true", function() {

    var condition = "(prompt1 == response1) and (prompt2 == response2)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "AND of two true parenthetical expressions should be true." );
});

test( "Test (a == a) and (b == b) and (c == c) : true", function() {

    var condition = "(prompt1 == response1) and (prompt2 == response2) and (number1 == 1)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "AND of three true parenthetical expressions should be true." );
});

test( "Test (a == a) or (b == b) : true", function() {

    var condition = "(prompt1 == response1) or (prompt2 == response2)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "OR of two true parenthetical expressions should be true." );
});

test( "Test (a == a) or (b == b) or (c == c) : true", function() {

    var condition = "(prompt1 == response1) or (prompt2 == response2) or (prompt3 == response3)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "OR of three true parenthetical expressions should be true." );
});

test( "Test (a == a and b == b) or (c == c) : true", function() {

    var condition = "(prompt1 == response1 and prompt2 == response2) or (prompt3 == response3)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "OR of two true parenthetical expressions should be true." );
});

test( "Test (a == a and c == b) or (c == c) : true", function() {

    var condition = "(prompt1 == response1 and prompt3 == response2) or (prompt3 == response3)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "OR of at least one true parenthetical expressions should be true." );
});

test( "Test (a == a and b == b) or (c == a) : true", function() {

    var condition = "(prompt1 == response1 and prompt2 == response2) or (prompt3 == response1)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "OR of at least one true parenthetical expressions should be true." );
});

test( "Test (a == a or b == b) and (c == c) : true", function() {

    var condition = "(prompt1 == response1 or prompt2 == response2) and (prompt3 == response3)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "AND of two true parenthetical expressions should be true." );
});

test( "Test (a == a or b == c) and (c == c) : true", function() {

    var condition = "(prompt1 == response1 or prompt2 == response3) and (prompt3 == response3)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "AND of two true parenthetical expressions should be true." );
});

test( "Test (a == a or b == c) and (c == c or d == d) : true", function() {

    var condition = "(prompt1 == response1 or prompt2 == response3) and (prompt3 == response3 or prompt4 == prompt4)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "AND of two true parenthetical expressions should be true." );
});

test( "Test (a == a and (b == b or c == d)) or (c == c) : true", function() {

    var condition = "(prompt1 == response1 and (prompt2 == response2 or prompt3 == prompt4)) or (prompt3 == response3)";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "Nested parenthetical expressions should be allowed." );
});

test( "Test (((a == a) and ((b == b) or (c == d))) or (c == c)) : true", function() {

    var condition = "(((prompt1 == response1) and ((prompt2 == response2) or (prompt3 == prompt4))) or (prompt3 == response3))";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "Nested parenthetical expressions should be allowed." );
});

test( "Test (((a == a) and ((b == b) or (c == d))) or (c == c)) and (((a == a) and ((b == b) or (c == d))) or (c == c)) : true", function() {

    var condition = "(((prompt1 == response1) and ((prompt2 == response2) or (prompt3 == prompt4))) or (prompt3 == response3)) and (((prompt1 == response1) and ((prompt2 == response2) or (prompt3 == prompt4))) or (prompt3 == response3))";

    ///
    var result = ConditionalParser.parse(condition, fixture.data);
    ///

    ok(result, "Long expressions with nested parenthetical expressions should be allowed." );
});

