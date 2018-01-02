var path = require("path")
var generate = require("markdown-it-testgen")

describe("markdown-it-sup", function() {
	var md = require("markdown-it")({ xhtmlOut: true }).use(require("../")())
	generate(path.join(__dirname, "fixtures/component.txt"), md)
})

describe("markdown-it-sup2", function() {
	var md = require("markdown-it")({ xhtmlOut: true }).use(
		require("../")({ jsonData: true })
	)
	generate(path.join(__dirname, "fixtures/component2.txt"), md)
})
