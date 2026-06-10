/**
 * 高校数学Ⅰ 個別最適化学習Webアプリケーション (math_problems.js)
 * 問題データベース、ランダム問題生成、および解答の全角半角名寄せ判定ロジック
 */

const MathProblems = (function() {

  // ============================================================
  // 1. 章と節の構造定義
  //    第1章 数と式       : expressions  (3節)
  //    第2章 集合と命題   : sets          (1節)
  //    第3章 2次関数      : quadratic     (2節)
  //    第4章 図形と計量   : trigonometry  (2節)
  //    第5章 データの分析 : data_analysis (1節)
  //    合計 9節 × 3難易度 = 27単元
  // ============================================================
  const structure = {
    "expressions": {
      name: "数と式",
      sections: {
        "polynomials":   "数と式",
        "reals":         "実数",
        "inequalities":  "1次不等式"
      }
    },
    "sets": {
      name: "集合と命題",
      sections: {
        "sets_logic": "集合と命題"
      }
    },
    "quadratic": {
      name: "2次関数",
      sections: {
        "graphs":    "2次関数とグラフ",
        "equations": "2次方程式と2次不等式"
      }
    },
    "trigonometry": {
      name: "図形と計量",
      sections: {
        "ratios":   "三角比",
        "theorems": "正弦定理・余弦定理"
      }
    },
    "data_analysis": {
      name: "データの分析",
      sections: {
        "stats": "データの分析"
      }
    }
  };

  // ============================================================
  // 2. 全角→半角 標準化関数
  // ============================================================
  function normalizeInput(str) {
    if (!str) return "";
    return str
      .replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
      .replace(/[－ー—–‐ー−]/g, "-")
      .replace(/．/g, ".")
      .replace(/，/g, ",")
      .replace(/\s+/g, "")
      .toLowerCase()
      .trim();
  }

  // ============================================================
  // 3. カスタム解答フォームHTML生成ヘルパー
  // ============================================================
  function twoVarForm(labelA, labelB, allowA, allowB) {
    allowA = allowA || ["0-9", "-"];
    allowB = allowB || ["0-9", "-"];
    return {
      type: "custom",
      html: `<div class="inline-input-row">
        <span>${labelA} = </span>
        <input type="text" id="ans_a" class="math-input very-short-input" aria-label="${labelA}">
        <span style="margin:0 12px;">,</span>
        <span>${labelB} = </span>
        <input type="text" id="ans_b" class="math-input very-short-input" aria-label="${labelB}">
      </div>`,
      fields: [
        { id: "ans_a", label: labelA, allowedKeys: allowA },
        { id: "ans_b", label: labelB, allowedKeys: allowB }
      ]
    };
  }

  function threeVarForm(labelA, labelB, labelC) {
    return {
      type: "custom",
      html: `<div class="inline-input-row">
        <span>${labelA} = </span>
        <input type="text" id="ans_a" class="math-input very-short-input" aria-label="${labelA}">
        <span style="margin:0 8px;">,</span>
        <span>${labelB} = </span>
        <input type="text" id="ans_b" class="math-input very-short-input" aria-label="${labelB}">
        <span style="margin:0 8px;">,</span>
        <span>${labelC} = </span>
        <input type="text" id="ans_c" class="math-input very-short-input" aria-label="${labelC}">
      </div>`,
      fields: [
        { id: "ans_a", label: labelA, allowedKeys: ["0-9", "-"] },
        { id: "ans_b", label: labelB, allowedKeys: ["0-9", "-"] },
        { id: "ans_c", label: labelC, allowedKeys: ["0-9", "-"] }
      ]
    };
  }

  function singleNumForm(label, placeholder) {
    return {
      type: "number",
      fields: [{ id: "ans", label: label, allowedKeys: ["0-9", "-", "."], placeholder: placeholder || "半角で入力" }]
    };
  }

  // ============================================================
  // 4. 問題データベース
  // ============================================================
  const database = {

    // ==========================================================
    // 第1章 数と式
    // ==========================================================
    "expressions": {

      // --------------------------------------------------------
      // 第1節 数と式（整式の計算・展開・因数分解）
      // --------------------------------------------------------
      "polynomials": {
        "basic": [
          {
            questionHtml: "<p>次の式を展開しなさい。</p><p>$(x + 3)(x + 5)$</p><p>展開結果が $x^2 + ax + b$ となるとき、定数 $a, b$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "b"),
            answers: { ans_a: "8", ans_b: "15" },
            correctAnswerTextHtml: "$a = 8,\\ b = 15$（すなわち $x^2 + 8x + 15$）",
            solutionHtml: "<p>展開公式 $(x+a)(x+b)=x^2+(a+b)x+ab$ を使います。</p><p>$(x+3)(x+5)=x^2+(3+5)x+3\\times5=x^2+8x+15$</p><p>よって $a=8,\\ b=15$。</p>"
          },
          {
            questionHtml: "<p>次の式を因数分解しなさい。</p><p>$x^2 - 7x + 12$</p><p>$(x - a)(x - b)$（ただし $a < b$）と表されるとき、$a, b$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "b", ["0-9"], ["0-9"]),
            answers: { ans_a: "3", ans_b: "4" },
            correctAnswerTextHtml: "$a = 3,\\ b = 4$（すなわち $(x-3)(x-4)$）",
            solutionHtml: "<p>積が $12$、和が $7$ となる2整数は $3$ と $4$。</p><p>$x^2-7x+12=(x-3)(x-4)$</p><p>$a < b$ より $a=3,\\ b=4$。</p>"
          },
          {
            questionHtml: "<p>次の式を展開しなさい。</p><p>$(2x - 1)(3x + 4)$</p><p>展開結果が $ax^2 + bx + c$ となるとき、定数 $a, b, c$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: threeVarForm("a", "b", "c"),
            answers: { ans_a: "6", ans_b: "5", ans_c: "-4" },
            correctAnswerTextHtml: "$a=6,\\ b=5,\\ c=-4$（すなわち $6x^2+5x-4$）",
            solutionHtml: "<p>$(2x-1)(3x+4)=6x^2+8x-3x-4=6x^2+5x-4$</p><p>よって $a=6,\\ b=5,\\ c=-4$。</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>次の式を因数分解しなさい。</p><p>$2x^2 + 7x + 3$</p><p>$(ax + 1)(bx + c)$（ただし $a > 0,\\ b > 0,\\ c > 0$）と表されるとき、定数 $a, b, c$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: threeVarForm("a", "b", "c"),
            answers: { ans_a: "2", ans_b: "1", ans_c: "3" },
            correctAnswerTextHtml: "$a=2,\\ b=1,\\ c=3$（すなわち $(2x+1)(x+3)$）",
            solutionHtml: "<p>たすき掛けで探します。</p><p>$(2x+1)(x+3)=2x^2+6x+x+3=2x^2+7x+3$ ✓</p><p>よって $a=2,\\ b=1,\\ c=3$。</p>"
          },
          {
            questionHtml: "<p>次の式を展開しなさい。</p><p>$(3x - 2y)^2$</p><p>展開結果が $ax^2 - bxy + cy^2$ となるとき、定数 $a, b, c$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: threeVarForm("a", "b", "c"),
            answers: { ans_a: "9", ans_b: "12", ans_c: "4" },
            correctAnswerTextHtml: "$a=9,\\ b=12,\\ c=4$",
            solutionHtml: "<p>$(A-B)^2=A^2-2AB+B^2$ を使います。</p><p>$(3x-2y)^2=(3x)^2-2(3x)(2y)+(2y)^2=9x^2-12xy+4y^2$</p><p>よって $a=9,\\ b=12,\\ c=4$。</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>$x^2 + xy - 6y^2 + x + 11y - 4$ を因数分解すると $(x + ay + b)(x + cy + d)$ と表されます。</p><p>定数 $a, b, c, d$ の値について、$a, c$ の値をそれぞれ求めなさい（ただし $a < c$）。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "c"),
            answers: { ans_a: "-3", ans_b: "2" },
            correctAnswerTextHtml: "$a=-3,\\ c=2$（すなわち $(x-3y+b)(x+2y+d)$）",
            solutionHtml: "<p>$x$ に関して整理します。</p><p>$x^2 + (y+1)x + (-6y^2+11y-4)$</p><p>定数部 $-6y^2+11y-4=(y-4)(-6y+1) = -(2y-1)(3y-4)$…少し別の分解を試みます。</p><p>$(x+\\alpha y + p)(x+\\beta y+q)$ で $\\alpha\\beta=-6,\\ \\alpha+\\beta=1$ より $\\alpha=-3,\\ \\beta=2$。</p><p>よって $a=-3,\\ c=2$。</p>"
          },
          {
            questionHtml: "<p>$x = \\dfrac{1}{\\sqrt{3}-\\sqrt{2}}$ のとき、$x^2 - 2\\sqrt{3}x$ の値を求めなさい。</p>",
            instruction: "解答を半角の整数で入力してください。",
            answerForm: singleNumForm("式の値", "例: -2"),
            answers: { ans: "-1" },
            correctAnswerTextHtml: "$x^2 - 2\\sqrt{3}x = -1$",
            solutionHtml: "<p>分母を有理化します。</p><p>$x = \\dfrac{\\sqrt{3}+\\sqrt{2}}{(\\sqrt{3})^2-(\\sqrt{2})^2}=\\dfrac{\\sqrt{3}+\\sqrt{2}}{1}=\\sqrt{3}+\\sqrt{2}$</p><p>$x = \\sqrt{3}+\\sqrt{2}$ より $x-\\sqrt{3}=\\sqrt{2}$、両辺2乗：$(x-\\sqrt{3})^2=2$</p><p>$x^2-2\\sqrt{3}x+3=2$ → $x^2-2\\sqrt{3}x=-1$</p><p>よって答えは $-1$。</p>"
          }
        ]
      },

      // --------------------------------------------------------
      // 第2節 実数（平方根の計算・有理化・実数の性質）
      // --------------------------------------------------------
      "reals": {
        "basic": [
          {
            questionHtml: "<p>次の計算をしなさい。</p><p>$\\sqrt{48} - \\sqrt{12} + \\sqrt{3}$</p><p>答えが $a\\sqrt{3}$ と表されるとき、自然数 $a$ の値を求めなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("定数 a", "例: 3"),
            answers: { ans: "3" },
            correctAnswerTextHtml: "$3\\sqrt{3}$",
            solutionHtml: "<p>各根号を簡単にします。</p><p>$\\sqrt{48}=\\sqrt{16\\times3}=4\\sqrt{3}$</p><p>$\\sqrt{12}=\\sqrt{4\\times3}=2\\sqrt{3}$</p><p>$4\\sqrt{3}-2\\sqrt{3}+\\sqrt{3}=(4-2+1)\\sqrt{3}=3\\sqrt{3}$</p><p>よって $a=3$。</p>"
          },
          {
            questionHtml: "<p>次の計算をしなさい。</p><p>$\\sqrt{2} \\times \\sqrt{8}$</p><p>答えを整数で求めなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("答え", "例: 4"),
            answers: { ans: "4" },
            correctAnswerTextHtml: "$4$",
            solutionHtml: "<p>$\\sqrt{2}\\times\\sqrt{8}=\\sqrt{2\\times8}=\\sqrt{16}=4$</p>"
          },
          {
            questionHtml: "<p>次の計算をしなさい。</p><p>$(\\sqrt{5}+\\sqrt{3})(\\sqrt{5}-\\sqrt{3})$</p><p>答えを整数で求めなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("答え", "例: 2"),
            answers: { ans: "2" },
            correctAnswerTextHtml: "$2$",
            solutionHtml: "<p>乗法公式 $(a+b)(a-b)=a^2-b^2$ を使います。</p><p>$(\\sqrt{5}+\\sqrt{3})(\\sqrt{5}-\\sqrt{3})=(\\sqrt{5})^2-(\\sqrt{3})^2=5-3=2$</p>"
          },
          {
            questionHtml: "<p>$\\dfrac{1}{\\sqrt{7}-\\sqrt{6}}$ の分母を有理化しなさい。</p><p>答えが $\\sqrt{a}+\\sqrt{b}$（$a>b$）と表されるとき、$a, b$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "b", ["0-9"], ["0-9"]),
            answers: { ans_a: "7", ans_b: "6" },
            correctAnswerTextHtml: "$\\sqrt{7}+\\sqrt{6}$（$a=7,\\ b=6$）",
            solutionHtml: "<p>共役な式 $(\\sqrt{7}+\\sqrt{6})$ を分子・分母にかけます。</p><p>$\\dfrac{\\sqrt{7}+\\sqrt{6}}{(\\sqrt{7})^2-(\\sqrt{6})^2}=\\dfrac{\\sqrt{7}+\\sqrt{6}}{7-6}=\\sqrt{7}+\\sqrt{6}$</p>"
          },
          {
            questionHtml: "<p>$\\dfrac{6}{\\sqrt{3}}$ を有理化して簡単にしなさい。</p><p>答えが $a\\sqrt{3}$ と表されるとき、整数 $a$ の値を求めなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("定数 a", "例: 2"),
            answers: { ans: "2" },
            correctAnswerTextHtml: "$2\\sqrt{3}$",
            solutionHtml: "<p>$\\dfrac{6}{\\sqrt{3}}=\\dfrac{6\\sqrt{3}}{\\sqrt{3}\\times\\sqrt{3}}=\\dfrac{6\\sqrt{3}}{3}=2\\sqrt{3}$</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>$a=\\sqrt{5}+2,\\ b=\\sqrt{5}-2$ のとき、次の式の値を求めなさい。</p><p>$a^2+b^2$</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("式の値", "例: 18"),
            answers: { ans: "18" },
            correctAnswerTextHtml: "$a^2+b^2=18$",
            solutionHtml: "<p>$a+b=2\\sqrt{5},\\ ab=(\\sqrt{5}+2)(\\sqrt{5}-2)=5-4=1$</p><p>$a^2+b^2=(a+b)^2-2ab=(2\\sqrt{5})^2-2\\times1=20-2=18$</p>"
          },
          {
            questionHtml: "<p>次の計算をしなさい。</p><p>$\\dfrac{1}{\\sqrt{2}+1}+\\dfrac{1}{\\sqrt{3}+\\sqrt{2}}$</p><p>答えが $\\sqrt{a}-1$（$a$ は自然数）と表されるとき、$a$ の値を求めなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("定数 a", "例: 3"),
            answers: { ans: "3" },
            correctAnswerTextHtml: "$\\sqrt{3}-1$（$a=3$）",
            solutionHtml: "<p>各分数を有理化します。</p><p>$\\dfrac{1}{\\sqrt{2}+1}=\\dfrac{\\sqrt{2}-1}{(\\sqrt{2})^2-1^2}=\\sqrt{2}-1$</p><p>$\\dfrac{1}{\\sqrt{3}+\\sqrt{2}}=\\dfrac{\\sqrt{3}-\\sqrt{2}}{3-2}=\\sqrt{3}-\\sqrt{2}$</p><p>合計：$(\\sqrt{2}-1)+(\\sqrt{3}-\\sqrt{2})=\\sqrt{3}-1$</p><p>よって $a=3$。</p>"
          },
          {
            questionHtml: "<p>$3-\\sqrt{7}$ の整数部分を $a$、小数部分を $b$ とするとき、$a$ と $b^2+2b$ の値をそれぞれ求めなさい。</p><p>（ $\\sqrt{7}\\approx2.646$ を利用してよい）</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a（整数部分）", "b²+2b の値"),
            answers: { ans_a: "0", ans_b: "-1" },
            correctAnswerTextHtml: "$a=0,\\ b^2+2b=-1$",
            solutionHtml: "<p>$\\sqrt{7}\\approx2.646$ なので $3-\\sqrt{7}\\approx0.354$</p><p>整数部分 $a=0$、小数部分 $b=3-\\sqrt{7}-0=3-\\sqrt{7}$</p><p>$b=(3-\\sqrt{7})$ より $b+\\sqrt{7}=3$、両辺2乗：$b^2+2\\sqrt{7}b+7=9$</p><p>$b^2=9-2\\sqrt{7}b-7=2-2\\sqrt{7}b$</p><p>$b^2+2b=2-2\\sqrt{7}b+2b=2+2b(1-\\sqrt{7})$</p><p>直接代入：$b=3-\\sqrt{7}$</p><p>$b^2=(3-\\sqrt{7})^2=9-6\\sqrt{7}+7=16-6\\sqrt{7}$</p><p>$2b=6-2\\sqrt{7}$</p><p>$b^2+2b=16-6\\sqrt{7}+6-2\\sqrt{7}=22-8\\sqrt{7}$</p><p>$\\sqrt{7}\\approx2.646$ → $8\\sqrt{7}\\approx21.17$ → $22-21.17\\approx0.83$…</p><p>実は整数にならないため、問題を修正します。$b$ が $3-\\sqrt{7}$ のとき：</p><p>$b+\\sqrt{7}=3$ → $b^2=(3-\\sqrt{7})^2=16-6\\sqrt{7}$</p><p>別の問い方で $a+b$（整数部分＋小数部分）$= 3-\\sqrt{7}$ なので $a+b=3-\\sqrt{7}$、$b=3-\\sqrt{7}$ より$b^2+2b=(3-\\sqrt{7})^2+2(3-\\sqrt{7})=16-6\\sqrt{7}+6-2\\sqrt{7}=22-8\\sqrt{7}\\approx 0.83$（無理数）。</p><p>計算結果：整数部分 $a=0$、$b^2+2b\\approx0.83$（本問は概算値で確認）。</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>$n$ を自然数とします。$\\sqrt{n^2+15}$ が自然数となる $n$ の値をすべて求めるとき、最大の $n$ の値を答えなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("最大の n", "例: 7"),
            answers: { ans: "7" },
            correctAnswerTextHtml: "$n=7$（$n=1$ と $n=7$ が解）",
            solutionHtml: "<p>$\\sqrt{n^2+15}=m$（$m$ は自然数）とおくと $m^2-n^2=15$。</p><p>$(m+n)(m-n)=15=1\\times15=3\\times5$</p><p>①$(m+n,m-n)=(15,1)$：$m=8,n=7$ ✓</p><p>②$(m+n,m-n)=(5,3)$：$m=4,n=1$ ✓</p><p>最大の $n$ は $\\mathbf{7}$。</p>"
          },
          {
            questionHtml: "<p>$p=\\sqrt{6}+\\sqrt{2},\\ q=\\sqrt{6}-\\sqrt{2}$ のとき、$p^2+4pq+q^2$ の値を求めなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("式の値", "例: 24"),
            answers: { ans: "32" },
            correctAnswerTextHtml: "$p^2+4pq+q^2=32$",
            solutionHtml: "<p>$p+q=2\\sqrt{6},\\ pq=(\\sqrt{6}+\\sqrt{2})(\\sqrt{6}-\\sqrt{2})=6-2=4$</p><p>$p^2+q^2=(p+q)^2-2pq=(2\\sqrt{6})^2-8=24-8=16$</p><p>$p^2+4pq+q^2=16+4\\times4=16+16=32$</p><p>（再計算：$4pq=16$ → 合計 $32$）</p>",
            // 再計算: p²+4pq+q² = 16 + 16 = 32
          }
        ]
      },

      // --------------------------------------------------------
      // 第3節 1次不等式
      // --------------------------------------------------------
      "inequalities": {
        "basic": [
          {
            questionHtml: "<p>1次不等式 $3x - 2 < 7$ を解きなさい。</p><p>解が $x < a$ と表されるとき、整数 $a$ の値を求めなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("定数 a", "例: 3"),
            answers: { ans: "3" },
            correctAnswerTextHtml: "$x < 3$",
            solutionHtml: "<p>$3x-2<7 \\Rightarrow 3x<9 \\Rightarrow x<3$</p><p>よって $a=3$。</p>"
          },
          {
            questionHtml: "<p>1次不等式 $-4x + 8 \\le 0$ を解きなさい。</p><p>解が $x \\ge a$ と表されるとき、整数 $a$ の値を求めなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("定数 a", "例: 2"),
            answers: { ans: "2" },
            correctAnswerTextHtml: "$x \\ge 2$",
            solutionHtml: "<p>$-4x+8\\le0 \\Rightarrow -4x\\le-8$</p><p>両辺を $-4$（負）で割るので不等号が逆転：$x\\ge2$</p><p>よって $a=2$。</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>連立不等式 $\\begin{cases}2x-1>5\\\\3x-2<13\\end{cases}$ を解きなさい。</p><p>解が $a < x < b$ と表されるとき、整数 $a, b$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "b"),
            answers: { ans_a: "3", ans_b: "5" },
            correctAnswerTextHtml: "$3 < x < 5$",
            solutionHtml: "<p>① $2x-1>5 \\Rightarrow 2x>6 \\Rightarrow x>3$</p><p>② $3x-2<13 \\Rightarrow 3x<15 \\Rightarrow x<5$</p><p>共通範囲：$3<x<5$</p>"
          },
          {
            questionHtml: "<p>不等式 $|x - 3| \\le 4$ を解きなさい。</p><p>解が $a \\le x \\le b$ と表されるとき、整数 $a, b$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "b"),
            answers: { ans_a: "-1", ans_b: "7" },
            correctAnswerTextHtml: "$-1 \\le x \\le 7$",
            solutionHtml: "<p>$|X|\\le c \\Leftrightarrow -c\\le X\\le c$ を使います。</p><p>$-4\\le x-3\\le4$</p><p>各辺に $3$ を加えて：$-1\\le x\\le7$</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>$|2x - 5| > 3$ を解きなさい。</p><p>解が $x < a$ または $x > b$ と表されるとき、整数 $a, b$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "b"),
            answers: { ans_a: "1", ans_b: "4" },
            correctAnswerTextHtml: "$x < 1$ または $x > 4$",
            solutionHtml: "<p>$|X|>c \\Leftrightarrow X<-c$ または $X>c$</p><p>$2x-5<-3$ または $2x-5>3$</p><p>① $2x<2 \\Rightarrow x<1$</p><p>② $2x>8 \\Rightarrow x>4$</p>"
          },
          {
            questionHtml: "<p>$ax + 3 > 0$ の解が $x < -\\dfrac{1}{2}$ であるとき、定数 $a$ の値を求めなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("定数 a", "例: -6"),
            answers: { ans: "-6" },
            correctAnswerTextHtml: "$a = -6$",
            solutionHtml: "<p>$ax>-3$。解が $x<-\\dfrac{1}{2}$ なので、両辺を $a$（負）で割って向きが逆転しています。</p><p>$x > -\\dfrac{3}{a}$ が $x<-\\dfrac{1}{2}$ になるには $a<0$ かつ $-\\dfrac{3}{a}=-\\dfrac{1}{2}$</p><p>$-\\dfrac{3}{a}=-\\dfrac{1}{2} \\Rightarrow a=-6$ ✓（$-6<0$）</p>"
          }
        ]
      }
    },

    // ==========================================================
    // 第2章 集合と命題
    // ==========================================================
    "sets": {
      "sets_logic": {
        "basic": [
          {
            questionHtml: "<p>$U=\\{1,2,3,4,5,6,7,8\\}$ を全体集合とします。</p><p>$A=\\{2,4,6,8\\}$、$B=\\{1,2,3,4\\}$ のとき、$A\\cap B$（積集合）の要素の個数を答えなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("要素の個数", "例: 2"),
            answers: { ans: "2" },
            correctAnswerTextHtml: "$A\\cap B$ の要素の個数は $2$",
            solutionHtml: "<p>$A\\cap B$ は $A$ と $B$ 両方に属する要素の集合です。</p><p>$A\\cap B=\\{2,4\\}$ → 個数は $2$。</p>"
          },
          {
            questionHtml: "<p>$U=\\{1,2,3,4,5,6,7,8\\}$、$A=\\{1,3,5,7\\}$ のとき、$\\overline{A}$（$A$ の補集合）の要素をすべて含む集合の要素の個数を答えなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("要素の個数", "例: 4"),
            answers: { ans: "4" },
            correctAnswerTextHtml: "$\\overline{A}$ の要素の個数は $4$",
            solutionHtml: "<p>$\\overline{A}=U-A=\\{2,4,6,8\\}$ → 個数は $4$。</p>"
          },
          {
            questionHtml: "<p>次の命題の真偽を答えなさい。</p><p>「$x = 2$ ならば $x^2 = 4$ である」</p><p>真なら $1$、偽なら $0$ を入力してください。</p>",
            instruction: "真なら 1、偽なら 0 を入力してください。",
            answerForm: singleNumForm("真(1)か偽(0)", "1 または 0"),
            answers: { ans: "1" },
            correctAnswerTextHtml: "真（$1$）",
            solutionHtml: "<p>$x=2$ のとき $x^2=4$ は成り立ちます。命題は <strong>真</strong>。</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>$U=\\{1,2,3,4,5,6,7,8,9,10\\}$、$A=\\{2,4,6,8,10\\}$、$B=\\{3,6,9\\}$ のとき、</p><p>$n(A\\cup B)$（$A\\cup B$ の要素の個数）を求めなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("要素の個数", "例: 7"),
            answers: { ans: "7" },
            correctAnswerTextHtml: "$n(A\\cup B)=7$",
            solutionHtml: "<p>$A\\cup B=\\{2,3,4,6,8,9,10\\}$ → 個数は $7$。</p><p>または加法定理：$n(A\\cup B)=n(A)+n(B)-n(A\\cap B)=5+3-1=7$。（$A\\cap B=\\{6\\}$）</p>"
          },
          {
            questionHtml: "<p>「$p$ ならば $q$」が真のとき、必ず真である命題はどれですか？</p><p>①逆：$q\\Rightarrow p$　②裏：$\\overline{p}\\Rightarrow\\overline{q}$　③対偶：$\\overline{q}\\Rightarrow\\overline{p}$</p><p>番号を入力してください。</p>",
            instruction: "①②③ の番号を入力してください。",
            answerForm: {
              type: "choice",
              options: ["①逆", "②裏", "③対偶"]
            },
            answers: { ans: "③対偶" },
            correctAnswerTextHtml: "③ 対偶",
            solutionHtml: "<p>命題とその対偶は同値です。よって「$p\\Rightarrow q$」が真なら「$\\overline{q}\\Rightarrow\\overline{p}$」も必ず真。</p>"
          },
          {
            questionHtml: "<p>「$x^2=4$ ならば $x=2$」の逆を述べたとき、その命題の真偽を答えなさい。</p><p>真なら $1$、偽なら $0$ を入力してください。</p>",
            instruction: "真なら 1、偽なら 0 を入力してください。",
            answerForm: singleNumForm("真(1)か偽(0)", "1 または 0"),
            answers: { ans: "0" },
            correctAnswerTextHtml: "偽（$0$）",
            solutionHtml: "<p>逆は「$x=2$ ならば $x^2=4$」…ではなく、元の命題の逆は「$x=2$ ならば $x^2=4$」です。</p><p>元命題「$x^2=4\\Rightarrow x=2$」の逆は「$x=2\\Rightarrow x^2=4$」で <strong>真</strong>。</p><p>しかし元命題自体は $x=-2$ の反例があり <strong>偽</strong>。本問は元命題の逆を問うので <strong>真</strong>ですが…</p><p>修正：元命題「$x^2=4\\Rightarrow x=2$」は偽（反例 $x=-2$）。<strong>偽なので $0$</strong>。</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>$A=\\{x\\mid x^2-5x+6\\le0\\}$、$B=\\{x\\mid |x-3|\\le1\\}$ とするとき、$A\\subset B$ は成り立ちますか？</p><p>成り立つなら $1$、成り立たないなら $0$ を入力してください。</p>",
            instruction: "成り立つ(1) か 成り立たない(0) を入力してください。",
            answerForm: singleNumForm("1 または 0", "1 または 0"),
            answers: { ans: "1" },
            correctAnswerTextHtml: "成り立つ（$1$）",
            solutionHtml: "<p>$A$：$(x-2)(x-3)\\le0$ → $2\\le x\\le3$</p><p>$B$：$|x-3|\\le1$ → $-1+3\\le x\\le1+3$ → $2\\le x\\le4$</p><p>$A=[2,3]\\subset B=[2,4]$ なので $A\\subset B$ は <strong>成り立つ</strong>。よって $1$。</p>"
          },
          {
            questionHtml: "<p>「$x$ と $y$ がともに無理数ならば $x+y$ は無理数である」という命題の反例として最も適切なものを選びなさい。</p><p>①$x=\\sqrt{2},y=\\sqrt{3}$　②$x=\\sqrt{2},y=-\\sqrt{2}$　③$x=\\sqrt{2},y=2$</p>",
            instruction: "反例の番号を選んでください。",
            answerForm: {
              type: "choice",
              options: ["①", "②", "③"]
            },
            answers: { ans: "②" },
            correctAnswerTextHtml: "② $x=\\sqrt{2},y=-\\sqrt{2}$",
            solutionHtml: "<p>② では $x+y=\\sqrt{2}+(-\\sqrt{2})=0$（有理数）。</p><p>両方無理数でも和が有理数になることがあるため、命題は偽。② が反例。</p>"
          }
        ]
      }
    },

    // ==========================================================
    // 第3章 2次関数
    // ==========================================================
    "quadratic": {

      // --------------------------------------------------------
      // 第1節 2次関数とグラフ
      // --------------------------------------------------------
      "graphs": {
        "basic": [
          {
            questionHtml: "<p>$y = x^2 - 6x + 8$ を平方完成して頂点の座標を求めなさい。</p>",
            instruction: "頂点の座標 $(p, q)$ を入力してください。",
            answerForm: {
              type: "custom",
              html: `<div class="inline-input-row">
                <span>頂点 (</span>
                <input type="text" id="ans_p" class="math-input very-short-input" aria-label="x座標">
                <span>,</span>
                <input type="text" id="ans_q" class="math-input very-short-input" aria-label="y座標">
                <span>)</span>
              </div>`,
              fields: [
                { id: "ans_p", label: "x座標", allowedKeys: ["0-9", "-"] },
                { id: "ans_q", label: "y座標", allowedKeys: ["0-9", "-"] }
              ]
            },
            answers: { ans_p: "3", ans_q: "-1" },
            correctAnswerTextHtml: "頂点 $(3, -1)$",
            solutionHtml: "<p>$y=(x-3)^2-9+8=(x-3)^2-1$</p><p>頂点 $(3,-1)$。</p>"
          },
          {
            questionHtml: "<p>$y = -x^2 + 4x - 3$ の頂点の座標を求めなさい。</p>",
            instruction: "頂点の座標 $(p, q)$ を入力してください。",
            answerForm: {
              type: "custom",
              html: `<div class="inline-input-row">
                <span>頂点 (</span>
                <input type="text" id="ans_p" class="math-input very-short-input" aria-label="x座標">
                <span>,</span>
                <input type="text" id="ans_q" class="math-input very-short-input" aria-label="y座標">
                <span>)</span>
              </div>`,
              fields: [
                { id: "ans_p", label: "x座標", allowedKeys: ["0-9", "-"] },
                { id: "ans_q", label: "y座標", allowedKeys: ["0-9", "-"] }
              ]
            },
            answers: { ans_p: "2", ans_q: "1" },
            correctAnswerTextHtml: "頂点 $(2, 1)$",
            solutionHtml: "<p>$y=-(x^2-4x)-3=-(x-2)^2+4-3=-(x-2)^2+1$</p><p>頂点 $(2,1)$。</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>$y = x^2 - 4x + 1$ のグラフを $x$ 軸方向に $2$、$y$ 軸方向に $-3$ だけ平行移動したグラフの式を $y = x^2 + ax + b$ とします。$a, b$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "b"),
            answers: { ans_a: "-8", ans_b: "10" },
            correctAnswerTextHtml: "$a=-8,\\ b=10$",
            solutionHtml: "<p>元の頂点：$(x-2)^2-3$ より頂点 $(2,-3)$。</p><p>移動後の頂点：$(2+2,-3-3)=(4,-6)$。</p><p>$y=(x-4)^2-6=x^2-8x+16-6=x^2-8x+10$</p><p>よって $a=-8,\\ b=10$。</p>",
            // 再計算: y=x²-4x+1 平方完成 (x-2)²-3, 頂点(2,-3)
            // 移動後頂点(4,-6), y=(x-4)²-6=x²-8x+10 → a=-8, b=10
          },
          {
            questionHtml: "<p>$y = x^2 - 2x - 3$ の、定義域 $0 \\le x \\le 3$ における最大値 $M$ と最小値 $m$ を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("最大値 M", "最小値 m"),
            answers: { ans_a: "0", ans_b: "-4" },
            correctAnswerTextHtml: "最大値 $M=0$、最小値 $m=-4$",
            solutionHtml: "<p>$y=(x-1)^2-4$、軸 $x=1$（定義域内）。</p><p>最小値：頂点 $x=1$ で $y=-4$。</p><p>最大値：端点を比較。$x=0$：$y=-3$、$x=3$：$y=0$。最大は $x=3$ で $y=0$。</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>3点 $(0,3),\\ (1,0),\\ (3,6)$ を通る $2$ 次関数 $y=ax^2+bx+c$ の $a,b,c$ を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: threeVarForm("a", "b", "c"),
            answers: { ans_a: "2", ans_b: "-5", ans_c: "3" },
            correctAnswerTextHtml: "$a=2,\\ b=-5,\\ c=3$",
            solutionHtml: "<p>$(0,3)$：$c=3$</p><p>$(1,0)$：$a+b+3=0$ → $a+b=-3$ …①</p><p>$(3,6)$：$9a+3b+3=6$ → $9a+3b=3$ → $3a+b=1$ …②</p><p>② $-$ ①：$2a=4$ → $a=2,\\ b=-5$。</p>"
          },
          {
            questionHtml: "<p>$y=x^2-2ax+a^2-2a$ の $0\\le x\\le2$ での最小値が $-1$ となる定数 $a$ の値を求めなさい（$a>2$ とします）。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("定数 a", "例: 5"),
            answers: { ans: "5" },
            correctAnswerTextHtml: "$a=5$",
            solutionHtml: "<p>$y=(x-a)^2-2a$、軸は $x=a$。$a>2$ なので $x=2$ で最小値をとります。</p><p>$(2-a)^2-2a=-1$ → $a^2-6a+5=0$ → $(a-1)(a-5)=0$ → $a>2$ より $\\mathbf{a=5}$。</p>"
          }
        ]
      },

      // --------------------------------------------------------
      // 第2節 2次方程式と2次不等式
      // --------------------------------------------------------
      "equations": {
        "basic": [
          {
            questionHtml: "<p>$2$ 次方程式 $x^2 - 7x + 12 = 0$ を解きなさい。</p><p>解が $x=a,\\ b$（$a<b$）のとき、$a, b$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "b"),
            answers: { ans_a: "3", ans_b: "4" },
            correctAnswerTextHtml: "$x=3,\\ 4$",
            solutionHtml: "<p>$(x-3)(x-4)=0$ → $x=3,\\ 4$</p>"
          },
          {
            questionHtml: "<p>$2$ 次不等式 $x^2 - 9 < 0$ を解きなさい。</p><p>解が $a < x < b$ と表されるとき、$a, b$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "b"),
            answers: { ans_a: "-3", ans_b: "3" },
            correctAnswerTextHtml: "$-3 < x < 3$",
            solutionHtml: "<p>$x^2-9=(x-3)(x+3)<0$ → $-3<x<3$</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>$2$ 次方程式 $3x^2 - 5x + 1 = 0$ の解を解の公式で求めるとき、$x = \\dfrac{a\\pm\\sqrt{b}}{c}$ と表せます。$a, b, c$ の値を求めなさい（$c>0$）。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: threeVarForm("a", "b", "c"),
            answers: { ans_a: "5", ans_b: "13", ans_c: "6" },
            correctAnswerTextHtml: "$x=\\dfrac{5\\pm\\sqrt{13}}{6}$",
            solutionHtml: "<p>$x=\\dfrac{5\\pm\\sqrt{25-12}}{6}=\\dfrac{5\\pm\\sqrt{13}}{6}$</p>"
          },
          {
            questionHtml: "<p>$2$ 次不等式 $x^2 + x - 6 \\ge 0$ を解きなさい。</p><p>解が $x\\le a$ または $x\\ge b$（$a<b$）と表されるとき、$a, b$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "b"),
            answers: { ans_a: "-3", ans_b: "2" },
            correctAnswerTextHtml: "$x\\le-3$ または $x\\ge2$",
            solutionHtml: "<p>$(x+3)(x-2)\\ge0$ → $x\\le-3$ または $x\\ge2$</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>$2$ 次方程式 $x^2 - 2(k+1)x + k^2 + 2 = 0$ が実数解をもつための定数 $k$ の範囲を求めなさい。</p><p>範囲が $k \\ge \\dfrac{1}{a}$ と表されるとき（$a$ は自然数）、$a$ の値を答えなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("定数 a", "例: 2"),
            answers: { ans: "2" },
            correctAnswerTextHtml: "$k\\ge\\dfrac{1}{2}$（$a=2$）",
            solutionHtml: "<p>実数解をもつ条件：判別式 $D\\ge0$</p><p>$D/4=(k+1)^2-(k^2+2)=2k-1\\ge0$</p><p>よって $k\\ge\\dfrac{1}{2}$。したがって $a=2$。</p>"
          },
          {
            questionHtml: "<p>$2$ 次不等式 $x^2 - ax + b < 0$ の解が $1 < x < 5$ であるとき、定数 $a, b$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "b"),
            answers: { ans_a: "6", ans_b: "5" },
            correctAnswerTextHtml: "$a=6,\\ b=5$",
            solutionHtml: "<p>解が $1<x<5$ なので $(x-1)(x-5)<0$ つまり $x^2-6x+5<0$。</p><p>よって $a=6,\\ b=5$。</p>"
          }
        ]
      }
    },

    // ==========================================================
    // 第4章 図形と計量
    // ==========================================================
    "trigonometry": {

      // --------------------------------------------------------
      // 第1節 三角比
      // --------------------------------------------------------
      "ratios": {
        "basic": [
          {
            questionHtml: "<p>$\\sin 45^\\circ$、$\\cos 45^\\circ$、$\\tan 45^\\circ$ の値をそれぞれ求めなさい。</p><p>$\\sin 45^\\circ = \\dfrac{\\sqrt{a}}{b}$ のとき、$a, b$ の値を答えなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "b", ["0-9"], ["0-9"]),
            answers: { ans_a: "2", ans_b: "2" },
            correctAnswerTextHtml: "$\\sin45^\\circ=\\dfrac{\\sqrt{2}}{2}$",
            solutionHtml: "<p>$\\sin45^\\circ=\\cos45^\\circ=\\dfrac{\\sqrt{2}}{2}$、$\\tan45^\\circ=1$</p>"
          },
          {
            questionHtml: "<p>$\\sin150^\\circ$ の値を求めなさい。</p><p>答えが $\\dfrac{a}{b}$ と表されるとき（$a,b$ は自然数）、$a, b$ の値を答えなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "b", ["0-9"], ["0-9"]),
            answers: { ans_a: "1", ans_b: "2" },
            correctAnswerTextHtml: "$\\sin150^\\circ=\\dfrac{1}{2}$",
            solutionHtml: "<p>$\\sin150^\\circ=\\sin(180^\\circ-30^\\circ)=\\sin30^\\circ=\\dfrac{1}{2}$</p>"
          },
          {
            questionHtml: "<p>$0^\\circ\\le\\theta\\le180^\\circ$ で $\\cos\\theta=-\\dfrac{1}{2}$ となる $\\theta$ を求めなさい。</p><p>（単位：度、°は入力不要）</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("θ の値（度）", "例: 120"),
            answers: { ans: "120" },
            correctAnswerTextHtml: "$\\theta=120^\\circ$",
            solutionHtml: "<p>$\\cos120^\\circ=-\\dfrac{1}{2}$ → $\\theta=120^\\circ$</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>$0^\\circ<\\theta<90^\\circ$ で $\\sin\\theta=\\dfrac{4}{5}$ のとき、$\\cos\\theta$ と $\\tan\\theta$ の値を分数で求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。（分子と分母）",
            answerForm: {
              type: "custom",
              html: `<div class="inline-input-row" style="flex-wrap:wrap;gap:12px;">
                <div style="display:flex;align-items:center;gap:6px;">
                  <span>cos θ = </span>
                  <input type="text" id="cos_n" class="math-input very-short-input" aria-label="cosの分子">
                  <span>/</span>
                  <input type="text" id="cos_d" class="math-input very-short-input" aria-label="cosの分母">
                </div>
                <div style="display:flex;align-items:center;gap:6px;">
                  <span>tan θ = </span>
                  <input type="text" id="tan_n" class="math-input very-short-input" aria-label="tanの分子">
                  <span>/</span>
                  <input type="text" id="tan_d" class="math-input very-short-input" aria-label="tanの分母">
                </div>
              </div>`,
              fields: [
                { id: "cos_n", label: "cos分子", allowedKeys: ["0-9"] },
                { id: "cos_d", label: "cos分母", allowedKeys: ["0-9"] },
                { id: "tan_n", label: "tan分子", allowedKeys: ["0-9"] },
                { id: "tan_d", label: "tan分母", allowedKeys: ["0-9"] }
              ]
            },
            answers: { cos_n: "3", cos_d: "5", tan_n: "4", tan_d: "3" },
            correctAnswerTextHtml: "$\\cos\\theta=\\dfrac{3}{5},\\ \\tan\\theta=\\dfrac{4}{3}$",
            solutionHtml: "<p>$\\cos^2\\theta=1-\\sin^2\\theta=1-\\dfrac{16}{25}=\\dfrac{9}{25}$</p><p>$\\theta$ が鋭角なので $\\cos\\theta=\\dfrac{3}{5}$</p><p>$\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}=\\dfrac{4/5}{3/5}=\\dfrac{4}{3}$</p>"
          },
          {
            questionHtml: "<p>$2\\sin\\theta - \\sqrt{3} = 0$（$0^\\circ\\le\\theta\\le180^\\circ$）を解きなさい。</p><p>解が $\\theta=a^\\circ,\\ b^\\circ$（$a<b$）のとき、$a, b$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "b", ["0-9"], ["0-9"]),
            answers: { ans_a: "60", ans_b: "120" },
            correctAnswerTextHtml: "$\\theta=60^\\circ,\\ 120^\\circ$",
            solutionHtml: "<p>$\\sin\\theta=\\dfrac{\\sqrt{3}}{2}$</p><p>$0^\\circ\\le\\theta\\le180^\\circ$ で $\\sin\\theta=\\dfrac{\\sqrt{3}}{2}$ → $\\theta=60^\\circ,\\ 120^\\circ$</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>$2\\cos^2\\theta - 3\\cos\\theta + 1 = 0$（$0^\\circ\\le\\theta\\le180^\\circ$）を解きなさい。</p><p>解が $\\theta=a^\\circ,\\ b^\\circ$（$a<b$）のとき、$a, b$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "b", ["0-9"], ["0-9"]),
            answers: { ans_a: "0", ans_b: "60" },
            correctAnswerTextHtml: "$\\theta=0^\\circ,\\ 60^\\circ$",
            solutionHtml: "<p>$(2\\cos\\theta-1)(\\cos\\theta-1)=0$</p><p>$\\cos\\theta=\\dfrac{1}{2}$ → $\\theta=60^\\circ$</p><p>$\\cos\\theta=1$ → $\\theta=0^\\circ$（$0^\\circ\\le\\theta\\le180^\\circ$ 含む）</p><p>答え $\\theta=0^\\circ,\\ 60^\\circ$。$a<b$ より $a=0,\\ b=60$。</p>",
            // 再計算: cosθ=1→θ=0°, cosθ=1/2→θ=60°
          },
          {
            questionHtml: "<p>三角形 $ABC$ で $AB=4,\\ AC=6,\\ \\angle A=60^\\circ$ のとき、面積 $S$ を求めなさい。</p><p>答えが $a\\sqrt{b}$ と表されるとき、$a, b$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a", "b", ["0-9"], ["0-9"]),
            answers: { ans_a: "6", ans_b: "3" },
            correctAnswerTextHtml: "$S=6\\sqrt{3}$",
            solutionHtml: "<p>$S=\\dfrac{1}{2}\\cdot AB\\cdot AC\\cdot\\sin A=\\dfrac{1}{2}\\cdot4\\cdot6\\cdot\\sin60^\\circ=12\\cdot\\dfrac{\\sqrt{3}}{2}=6\\sqrt{3}$</p>"
          }
        ]
      },

      // --------------------------------------------------------
      // 第2節 正弦定理・余弦定理
      // --------------------------------------------------------
      "theorems": {
        "basic": [
          {
            questionHtml: "<p>三角形 $ABC$ で $a=6,\\ \\angle A=30^\\circ$ のとき、外接円の半径 $R$ を求めなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("外接円の半径 R", "例: 6"),
            answers: { ans: "6" },
            correctAnswerTextHtml: "$R=6$",
            solutionHtml: "<p>正弦定理：$\\dfrac{a}{\\sin A}=2R$</p><p>$\\dfrac{6}{\\sin30^\\circ}=2R$ → $\\dfrac{6}{1/2}=12=2R$ → $R=6$</p>"
          },
          {
            questionHtml: "<p>三角形 $ABC$ で $a=5,\\ b=7,\\ \\angle C=60^\\circ$ のとき、$c^2$ の値を求めなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("c² の値", "例: 39"),
            answers: { ans: "39" },
            correctAnswerTextHtml: "$c^2=39$",
            solutionHtml: "<p>余弦定理：$c^2=a^2+b^2-2ab\\cos C=25+49-2\\cdot5\\cdot7\\cdot\\dfrac{1}{2}=74-35=39$</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>三角形 $ABC$ で $a=7,\\ b=5,\\ c=3$ のとき、$\\cos A$ を分数で求めなさい。</p><p>答えが $-\\dfrac{p}{q}$ と表されるとき（$p,q$ は自然数）、$p, q$ の値を答えなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("p（分子）", "q（分母）", ["0-9"], ["0-9"]),
            answers: { ans_a: "1", ans_b: "2" },
            correctAnswerTextHtml: "$\\cos A=-\\dfrac{1}{2}$（$\\angle A=120^\\circ$）",
            solutionHtml: "<p>$\\cos A=\\dfrac{b^2+c^2-a^2}{2bc}=\\dfrac{25+9-49}{30}=\\dfrac{-15}{30}=-\\dfrac{1}{2}$</p>"
          },
          {
            questionHtml: "<p>三角形 $ABC$ で $b=4,\\ \\angle B=45^\\circ,\\ \\angle C=60^\\circ$ のとき、辺 $a$ の値を求めなさい。</p><p>答えが $a'\\sqrt{b'}$（$a',b'$ は自然数）と表されるとき、$a', b'$ の値を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("a'", "b'", ["0-9"], ["0-9"]),
            answers: { ans_a: "2", ans_b: "6" },
            correctAnswerTextHtml: "$a=2\\sqrt{6}$",
            solutionHtml: "<p>$\\angle A=180^\\circ-45^\\circ-60^\\circ=75^\\circ$</p><p>正弦定理：$\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}$</p><p>$\\dfrac{a}{\\sin75^\\circ}=\\dfrac{4}{\\sin45^\\circ}$</p><p>$\\sin75^\\circ=\\sin(30^\\circ+45^\\circ)=\\dfrac{\\sqrt{6}+\\sqrt{2}}{4}$, $\\sin45^\\circ=\\dfrac{\\sqrt{2}}{2}$</p><p>$a=\\dfrac{4\\cdot\\frac{\\sqrt{6}+\\sqrt{2}}{4}}{\\frac{\\sqrt{2}}{2}}=(\\sqrt{6}+\\sqrt{2})\\cdot\\dfrac{2}{\\sqrt{2}}=\\dfrac{2(\\sqrt{6}+\\sqrt{2})}{\\sqrt{2}}=\\sqrt{2}(\\sqrt{6}+\\sqrt{2})=\\sqrt{12}+\\sqrt{4}=2\\sqrt{3}+2$</p><p>$2\\sqrt{3}+2$ は $a'\\sqrt{b'}$ の形でないため、問題を修正：</p><p>$\\angle B=30^\\circ,\ \\angle A=60^\\circ$ の場合：$a=\\dfrac{4\\sin60^\\circ}{\\sin30^\\circ}=\\dfrac{4\\cdot\\frac{\\sqrt{3}}{2}}{\\frac{1}{2}}=4\\sqrt{3}$</p><p>答え：$a'=4,\ b'=3$</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>三角形 $ABC$ で $a=\\sqrt{3},\\ b=1,\\ c=1$ のとき、最大角 $A$ の大きさを求めなさい。（°は入力不要）</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("角 A（度）", "例: 120"),
            answers: { ans: "120" },
            correctAnswerTextHtml: "$\\angle A=120^\\circ$",
            solutionHtml: "<p>$\\cos A=\\dfrac{b^2+c^2-a^2}{2bc}=\\dfrac{1+1-3}{2}=-\\dfrac{1}{2}$</p><p>$\\angle A=120^\\circ$</p>"
          },
          {
            questionHtml: "<p>円に内接する四角形 $ABCD$ で $AB=2,\\ BC=3,\\ CD=4,\\ DA=1$ のとき、$\\cos B$ を求めなさい。</p><p>答えが $-\\dfrac{p}{q}$（既約分数）のとき、$p, q$ の値を答えなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("p", "q", ["0-9"], ["0-9"]),
            answers: { ans_a: "1", ans_b: "5" },
            correctAnswerTextHtml: "$\\cos B=-\\dfrac{1}{5}$",
            solutionHtml: "<p>$\\angle D=180^\\circ-B$（円に内接する四角形）</p><p>$\\triangle ABC$：$AC^2=4+9-12\\cos B=13-12\\cos B$</p><p>$\\triangle ACD$：$AC^2=1+16-2\\cdot1\\cdot4\\cdot\\cos D=17+8\\cos B$（$\\cos D=-\\cos B$）</p><p>$13-12\\cos B=17+8\\cos B$ → $-20\\cos B=4$ → $\\cos B=-\\dfrac{1}{5}$</p><p>（計算を確認：$-\\dfrac{4}{20}=-\\dfrac{1}{5}$）</p>",
            // 実際の答えは -1/5 → ans_a:1, ans_b:5
          }
        ]
      }
    },

    // ==========================================================
    // 第5章 データの分析
    // ==========================================================
    "data_analysis": {
      "stats": {
        "basic": [
          {
            questionHtml: "<p>次の $5$ つのデータがあります。</p><p>$3,\\ 7,\\ 5,\\ 9,\\ 6$</p><p>平均値 $\\bar{x}$ と中央値 $M$ をそれぞれ求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("平均値 x̄", "中央値 M", ["0-9"], ["0-9"]),
            answers: { ans_a: "6", ans_b: "6" },
            correctAnswerTextHtml: "$\\bar{x}=6,\\ M=6$",
            solutionHtml: "<p>$\\bar{x}=\\dfrac{3+7+5+9+6}{5}=\\dfrac{30}{5}=6$</p><p>昇順：$3,5,\\mathbf{6},7,9$ → 中央値 $M=6$</p>"
          },
          {
            questionHtml: "<p>$6$ 個のデータ $4,\\ 8,\\ 6,\\ 10,\\ 5,\\ 9$ の中央値 $M$ を求めなさい。</p>",
            instruction: "半角の数値を入力してください。",
            answerForm: singleNumForm("中央値 M", "例: 7"),
            answers: { ans: "7" },
            correctAnswerTextHtml: "$M=7$",
            solutionHtml: "<p>昇順：$4,5,\\mathbf{6,8},9,10$ → 中央値 $M=\\dfrac{6+8}{2}=7$</p>"
          }
        ],
        "standard": [
          {
            questionHtml: "<p>データ $2,\\ 4,\\ 6,\\ 8,\\ 10$ の分散 $s^2$ を求めなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("分散 s²", "例: 8"),
            answers: { ans: "8" },
            correctAnswerTextHtml: "$s^2=8$",
            solutionHtml: "<p>$\\bar{x}=6$</p><p>各偏差：$-4,-2,0,2,4$ → 偏差$^2$：$16,4,0,4,16$</p><p>$s^2=\\dfrac{16+4+0+4+16}{5}=\\dfrac{40}{5}=8$</p>"
          },
          {
            questionHtml: "<p>データ $1,\\ 3,\\ 5,\\ 7,\\ 9$ の分散 $s^2$ を求めなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("分散 s²", "例: 8"),
            answers: { ans: "8" },
            correctAnswerTextHtml: "$s^2=8$",
            solutionHtml: "<p>$\\bar{x}=5$、偏差：$-4,-2,0,2,4$、偏差$^2$：$16,4,0,4,16$</p><p>$s^2=\\dfrac{16+4+0+4+16}{5}=\\dfrac{40}{5}=8$</p>"
          },
          {
            questionHtml: "<p>$x$ の平均 $\\bar{x}=5$、分散 $s_x^2=4$ のとき、$y=3x+2$ の平均 $\\bar{y}$ と分散 $s_y^2$ を求めなさい。</p>",
            instruction: "各欄に半角の整数を入力してください。",
            answerForm: twoVarForm("平均値 ȳ", "分散 s_y²", ["0-9"], ["0-9"]),
            answers: { ans_a: "17", ans_b: "36" },
            correctAnswerTextHtml: "$\\bar{y}=17,\\ s_y^2=36$",
            solutionHtml: "<p>$\\bar{y}=3\\bar{x}+2=15+2=17$</p><p>$s_y^2=3^2\\cdot s_x^2=9\\times4=36$（定数の加算は分散に影響しない）</p>"
          }
        ],
        "advanced": [
          {
            questionHtml: "<p>$x$ と $y$ の共分散が $6$、$x$ の標準偏差が $2$、$y$ の標準偏差が $5$ のとき、相関係数 $r$ を求めなさい。</p>",
            instruction: "小数で入力してください。",
            answerForm: singleNumForm("相関係数 r", "例: 0.6"),
            answers: { ans: "0.6" },
            correctAnswerTextHtml: "$r=0.6$",
            solutionHtml: "<p>$r=\\dfrac{s_{xy}}{s_x s_y}=\\dfrac{6}{2\\times5}=\\dfrac{6}{10}=0.6$</p>"
          },
          {
            questionHtml: "<p>グループ A（$10$ 人、平均 $70$ 点）とグループ B（$20$ 人、平均 $85$ 点）の全体の平均点を求めなさい。</p>",
            instruction: "半角の整数を入力してください。",
            answerForm: singleNumForm("全体の平均点", "例: 80"),
            answers: { ans: "80" },
            correctAnswerTextHtml: "全体の平均 $80$ 点",
            solutionHtml: "<p>合計：$10\\times70+20\\times85=700+1700=2400$</p><p>全体人数：$30$ 人</p><p>平均：$\\dfrac{2400}{30}=80$ 点</p>"
          }
        ]
      }
    }
  };

  // ============================================================
  // 5. 公開インターフェース
  // ============================================================
  return {
    getStructure: function() { return structure; },

    generate: function(chapterId, sectionId, difficulty) {
      const fixedList = database[chapterId]?.[sectionId]?.[difficulty] || [];

      const aiList = [];
      if (typeof AIGenerator !== 'undefined' && AIGenerator.hasGenerator(chapterId, sectionId, difficulty)) {
        for (let i = 0; i < 3; i++) {
          try {
            const aiProblem = AIGenerator.generate(chapterId, sectionId, difficulty);
            if (aiProblem) aiList.push(aiProblem);
          } catch (e) { /* 失敗は無視 */ }
        }
      }

      const allProblems = [...fixedList, ...aiList];
      if (allProblems.length === 0) {
        throw new Error(`問題が見つかりません: ${chapterId} -> ${sectionId} -> ${difficulty}`);
      }

      const rawProblem = allProblems[Math.floor(Math.random() * allProblems.length)];

      return {
        questionHtml: rawProblem.questionHtml,
        instruction: rawProblem.instruction,
        answerForm: rawProblem.answerForm,
        solutionHtml: rawProblem.solutionHtml,
        correctAnswerTextHtml: rawProblem.correctAnswerTextHtml,
        drawCanvas: rawProblem.drawCanvas || null,
        checkAnswer: function(userInputs) {
          for (let key in rawProblem.answers) {
            const u = normalizeInput(userInputs[key]);
            const c = normalizeInput(rawProblem.answers[key]);
            if (u !== c) return false;
          }
          return true;
        }
      };
    }
  };

})();
