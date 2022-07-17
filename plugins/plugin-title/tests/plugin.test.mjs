import chai from 'chai'
import freesewing from '@freesewing/core'
import plugin from '../dist/index.mjs'

const expect = chai.expect

describe('Title Plugin Tests', () => {
  const pattern = new freesewing.Pattern().use(plugin)
  pattern.draft().render()

  it("Should run the title macro", () => {
    let pattern = new freesewing.Pattern({ name: "testPattern", version: 99 });
    pattern.draft = function() {};
    pattern.use(plugin);
    pattern.parts.test = new pattern.Part();
    pattern.parts.test.points.anchor = new pattern.Point(-12, -34);
    let { macro } = pattern.parts.test.shorthand();
    macro("title", {
      at: pattern.parts.test.points.anchor,
      nr: 3,
      title: "unitTest",
      cutList: false
    });
    pattern.render();
    let p = pattern.parts.test.points.__titleNr;
    expect(p.x).to.equal(-12);
    expect(p.y).to.equal(-34);
    expect(p.attributes.get("data-text")).to.equal("3");
    expect(p.attributes.get("data-text-class")).to.equal(
      "text-4xl fill-note font-bold"
    );
    expect(p.attributes.get("data-text-x")).to.equal("-12");
    expect(p.attributes.get("data-text-y")).to.equal("-34");
    p = pattern.parts.test.points.__titleName;
    expect(p.attributes.get("data-text")).to.equal("unitTest");
    expect(p.attributes.get("data-text-class")).to.equal("text-lg fill-current font-bold");
    expect(p.attributes.get("data-text-x")).to.equal("-12");
    expect(p.attributes.get("data-text-y")).to.equal("-26");
    p = pattern.parts.test.points.__titlePattern;
    expect(p.attributes.get("data-text")).to.equal("testPattern v99");
    expect(p.attributes.get("data-text-class")).to.equal(
      "fill-note"
    );
    expect(p.attributes.get("data-text-x")).to.equal("-12");
    expect(p.attributes.get("data-text-y")).to.equal("-18");
  });

  it("Should run the title macro with append flag", () => {
    let pattern = new freesewing.Pattern({ name: "testPattern", version: 99 });
    pattern.draft = function() {};
    pattern.use(plugin);
    pattern.parts.test = new pattern.Part();
    pattern.parts.test.points.anchor = new pattern.Point(-12, -34).attr(
      "data-text",
      "#"
    );
    let { macro } = pattern.parts.test.shorthand();
    macro("title", {
      at: pattern.parts.test.points.anchor,
      nr: 3,
      title: "unitTest",
      append: true,
      cutList: false
    });
    pattern.render();
    let p = pattern.parts.test.points.__titleNr;
    expect(p.x).to.equal(-12);
    expect(p.y).to.equal(-34);
    expect(p.attributes.get("data-text")).to.equal("# 3");
    expect(p.attributes.get("data-text-class")).to.equal(
      "text-4xl fill-note font-bold"
    );
    expect(p.attributes.get("data-text-x")).to.equal("-12");
    expect(p.attributes.get("data-text-y")).to.equal("-34");
  });

  it("Should run the title macro with point prefix", () => {
    let pattern = new freesewing.Pattern({ name: "testPattern", version: 99 });
    pattern.draft = function() {};
    pattern.use(plugin);
    pattern.parts.test = new pattern.Part();
    pattern.parts.test.points.anchor = new pattern.Point(-12, -34).attr(
      "data-text",
      "#"
    );
    let { macro } = pattern.parts.test.shorthand();
    macro("title", {
      at: pattern.parts.test.points.anchor,
      nr: 3,
      title: "unitTest",
      prefix: "foo",
      cutList: false
    });
    pattern.render();
    let p = pattern.parts.test.points._foo_titleNr;
    expect(p.x).to.equal(-12);
    expect(p.y).to.equal(-34);
    expect(p.attributes.get("data-text")).to.equal("3");
    expect(p.attributes.get("data-text-class")).to.equal(
      "text-4xl fill-note font-bold"
    );
    expect(p.attributes.get("data-text-x")).to.equal("-12");
    expect(p.attributes.get("data-text-y")).to.equal("-34");
    p = pattern.parts.test.points._foo_titleName;
    expect(p.attributes.get("data-text")).to.equal("unitTest");
    expect(p.attributes.get("data-text-class")).to.equal("text-lg fill-current font-bold");
    expect(p.attributes.get("data-text-x")).to.equal("-12");
    expect(p.attributes.get("data-text-y")).to.equal("-26");
    p = pattern.parts.test.points._foo_titlePattern;
    expect(p.attributes.get("data-text")).to.equal("testPattern v99");
    expect(p.attributes.get("data-text-class")).to.equal("fill-note");
    expect(p.attributes.get("data-text-x")).to.equal("-12");
    expect(p.attributes.get("data-text-y")).to.equal("-18");
  });

  describe('with cutlist: true', () => {
    it("Should run the title macro if the piece has no cutList config", () => {
      let pattern = new freesewing.Pattern({ name: "testPattern", version: 99 });
      pattern.draft = function() {};
      pattern.use(plugin);
      pattern.parts.test = new pattern.Part('test');
      pattern.parts.test.points.anchor = new pattern.Point(-12, -34);
      let { macro } = pattern.parts.test.shorthand();
      macro("title", {
        at: pattern.parts.test.points.anchor,
        nr: 3,
        title: "unitTest",
      });
      pattern.render();
      let p = pattern.parts.test.points.__titleNr;
      expect(p.x).to.equal(-12);
      expect(p.y).to.equal(-34);
      expect(p.attributes.get("data-text")).to.equal("3");
      expect(p.attributes.get("data-text-class")).to.equal(
        "text-4xl fill-note font-bold"
      );
      expect(p.attributes.get("data-text-x")).to.equal("-12");
      expect(p.attributes.get("data-text-y")).to.equal("-34");
      p = pattern.parts.test.points.__titleName;
      expect(p.attributes.get("data-text")).to.equal("unitTest");
      expect(p.attributes.get("data-text-class")).to.equal("text-lg fill-current font-bold");
      expect(p.attributes.get("data-text-x")).to.equal("-12");
      expect(p.attributes.get("data-text-y")).to.equal("-26");
      p = pattern.parts.test.points.__titleCut;
      expect(p.attributes.get("data-text")).to.equal("Cut 1");
      expect(p.attributes.get("data-text-class")).to.equal("fill-secondary")
      expect(p.attributes.get("data-text-x")).to.equal("-12")
      expect(p.attributes.get("data-text-y")).to.equal("-18")
      p = pattern.parts.test.points.__titlePattern;
      expect(p.attributes.get("data-text")).to.equal("testPattern v99");
      expect(p.attributes.get("data-text-class")).to.equal(
        "fill-note"
      );
      expect(p.attributes.get("data-text-x")).to.equal("-12");
      expect(p.attributes.get("data-text-y")).to.equal("-10");
    });

    it("Should run the title macro for a duplicated part", () => {
      let pattern = new freesewing.Pattern({ name: "testPattern", version: 99, cutList: {
        test: {
          cut: 2
        }
      } });
      pattern.draft = function() {};
      pattern.use(plugin);
      pattern.parts.test = new pattern.Part('test_cutPiece1');
      pattern.parts.test.points.anchor = new pattern.Point(-12, -34);
      let { macro } = pattern.parts.test.shorthand();
      macro("title", {
        at: pattern.parts.test.points.anchor,
        nr: 3,
        title: "unitTest",
      });
      pattern.render();
      let p = pattern.parts.test.points.__titleNr;
      expect(p.x).to.equal(-12);
      expect(p.y).to.equal(-34);
      expect(p.attributes.get("data-text")).to.equal("3");
      expect(p.attributes.get("data-text-class")).to.equal(
        "text-4xl fill-note font-bold"
      );
      expect(p.attributes.get("data-text-x")).to.equal("-12");
      expect(p.attributes.get("data-text-y")).to.equal("-34");
      p = pattern.parts.test.points.__titleName;
      expect(p.attributes.get("data-text")).to.equal("unitTest");
      expect(p.attributes.get("data-text-class")).to.equal("text-lg fill-current font-bold");
      expect(p.attributes.get("data-text-x")).to.equal("-12");
      expect(p.attributes.get("data-text-y")).to.equal("-26");
      p = pattern.parts.test.points.__titleCut;
      expect(p.attributes.get("data-text")).to.equal("Cut 2");
      expect(p.attributes.get("data-text-class")).to.equal("fill-secondary")
      expect(p.attributes.get("data-text-x")).to.equal("-12")
      expect(p.attributes.get("data-text-y")).to.equal("-18")
      p = pattern.parts.test.points.__titlePattern;
      expect(p.attributes.get("data-text")).to.equal("testPattern v99");
      expect(p.attributes.get("data-text-class")).to.equal(
        "fill-note"
      );
      expect(p.attributes.get("data-text-x")).to.equal("-12");
      expect(p.attributes.get("data-text-y")).to.equal("-10");
    });

    it("Should run the title macro for a paired part", () => {
      let pattern = new freesewing.Pattern({ name: "testPattern", version: 99, cutList: {
        test: {
          cut: 2,
          isPair: true
        }
      } });
      pattern.draft = function() {};
      pattern.use(plugin);
      pattern.parts.test = new pattern.Part('test');
      pattern.parts.test.points.anchor = new pattern.Point(-12, -34);
      let { macro } = pattern.parts.test.shorthand();
      macro("title", {
        at: pattern.parts.test.points.anchor,
        nr: 3,
        title: "unitTest",
      });
      pattern.render();
      let p = pattern.parts.test.points.__titleNr;
      expect(p.x).to.equal(-12);
      expect(p.y).to.equal(-34);
      expect(p.attributes.get("data-text")).to.equal("3");
      expect(p.attributes.get("data-text-class")).to.equal(
        "text-4xl fill-note font-bold"
      );
      expect(p.attributes.get("data-text-x")).to.equal("-12");
      expect(p.attributes.get("data-text-y")).to.equal("-34");
      p = pattern.parts.test.points.__titleName;
      expect(p.attributes.get("data-text")).to.equal("unitTest");
      expect(p.attributes.get("data-text-class")).to.equal("text-lg fill-current font-bold");
      expect(p.attributes.get("data-text-x")).to.equal("-12");
      expect(p.attributes.get("data-text-y")).to.equal("-26");
      p = pattern.parts.test.points.__titleCut;
      expect(p.attributes.get("data-text")).to.equal("Cut 1 Pair");
      expect(p.attributes.get("data-text-class")).to.equal("fill-secondary")
      expect(p.attributes.get("data-text-x")).to.equal("-12")
      expect(p.attributes.get("data-text-y")).to.equal("-18")
      p = pattern.parts.test.points.__titlePattern;
      expect(p.attributes.get("data-text")).to.equal("testPattern v99");
      expect(p.attributes.get("data-text-class")).to.equal(
        "fill-note"
      );
      expect(p.attributes.get("data-text-x")).to.equal("-12");
      expect(p.attributes.get("data-text-y")).to.equal("-10");
    });

    it("Should run the title macro for a multiply paired part", () => {
      let pattern = new freesewing.Pattern({ name: "testPattern", version: 99, cutList: {
        test: {
          cut: 4,
          isPair: true
        }
      } });
      pattern.draft = function() {};
      pattern.use(plugin);
      pattern.parts.test = new pattern.Part('test');
      pattern.parts.test.points.anchor = new pattern.Point(-12, -34);
      let { macro } = pattern.parts.test.shorthand();
      macro("title", {
        at: pattern.parts.test.points.anchor,
        nr: 3,
        title: "unitTest",
      });
      pattern.render();
      let p = pattern.parts.test.points.__titleNr;
      expect(p.x).to.equal(-12);
      expect(p.y).to.equal(-34);
      expect(p.attributes.get("data-text")).to.equal("3");
      expect(p.attributes.get("data-text-class")).to.equal(
        "text-4xl fill-note font-bold"
      );
      expect(p.attributes.get("data-text-x")).to.equal("-12");
      expect(p.attributes.get("data-text-y")).to.equal("-34");
      p = pattern.parts.test.points.__titleName;
      expect(p.attributes.get("data-text")).to.equal("unitTest");
      expect(p.attributes.get("data-text-class")).to.equal("text-lg fill-current font-bold");
      expect(p.attributes.get("data-text-x")).to.equal("-12");
      expect(p.attributes.get("data-text-y")).to.equal("-26");
      p = pattern.parts.test.points.__titleCut;
      expect(p.attributes.get("data-text")).to.equal("Cut 2 Pairs");
      expect(p.attributes.get("data-text-class")).to.equal("fill-secondary")
      expect(p.attributes.get("data-text-x")).to.equal("-12")
      expect(p.attributes.get("data-text-y")).to.equal("-18")
      p = pattern.parts.test.points.__titlePattern;
      expect(p.attributes.get("data-text")).to.equal("testPattern v99");
      expect(p.attributes.get("data-text-class")).to.equal(
        "fill-note"
      );
      expect(p.attributes.get("data-text-x")).to.equal("-12");
      expect(p.attributes.get("data-text-y")).to.equal("-10");
    });
  })
});
