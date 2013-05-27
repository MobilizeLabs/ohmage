module( "util.UUIDGen", {
  setup: function() {
    //No setup required.
  },
  teardown: function() {
    //No teardown required.
  }
});

test( "Test generate()", function() {

    ///
    var uuid = UUIDGen.generate();
    ///

    equal(uuid.length, 36, "The length of the generated UUID should be 36.");
    ok(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/.test(uuid), "The format of the UUID should be according to RFC 4122.");

});
