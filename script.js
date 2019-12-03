Vue.component("cube", {
  template: `
    <div class='cube' :class='{space:isSpace,correct:isCorrect}' @click='move'>{{val}}</div>
  `,
  props: {
    val: {
      required: true
    },
    pos: {
      required: true
    },
    num: {
      required: true
    }
  },
  computed: {
    isSpace() {
      return this.val === this.num * this.num;
    },
    isCorrect() {
      return this.val === this.pos.x * this.num + (this.pos.y + 1);
    }
  },
  methods: {
    move() {
      this.$emit("swap-check");
    },
  }
});

function setList(total) {
  let list = [];
  for (let i = 1; i <= total; i++) {
    list.push(i);
  }
  return list;
}

function setGrid(num) {
  let list = setList(num * num);
  let grid = [];
  for (let i = 0; i < num; i++) {
    grid.push([]);
  }
  list.forEach((e, i) => {
    let x = Math.floor(i / num);
    grid[x].push({
      value: e
    });
  });
  return grid;
}

new Vue({
  el: "#app",
  data: {
    num: 3,
    totalMoves: 0,
    grid: []
  },
  computed: {
    totalCubes() {
      return this.num * this.num;
    },
    getZeroPosition() {
      let obj = {};
      this.grid.forEach((e, i) => {
        e.forEach((el, j) => {
          if (el.value === this.totalCubes) obj = { x: i, y: j };
        });
      });
      return obj;
    },
    winCheck() {
      let ans = setGrid(this.num);
      if (JSON.stringify(this.grid) === JSON.stringify(ans)) return true;
      else return false;
    }
  },
  methods: {
    swapHandler(pos) {
      let nowPos = pos;
      let zeroPos = this.getZeroPosition;
      if (
        Math.abs(nowPos.x - zeroPos.x) + Math.abs(nowPos.y - zeroPos.y) ===
        1
      ) {
        let temp;
        temp = this.grid[nowPos.x][nowPos.y].value;
        this.grid[nowPos.x][nowPos.y].value = this.totalCubes;
        this.grid[zeroPos.x][zeroPos.y].value = temp;
        this.totalMoves += 1;
      }
    },
    shuffle() {
      for (let i = 0; i < 1000; i++) {
        let randomPos = {
          x: Math.floor(Math.random() * this.num),
          y: Math.floor(Math.random() * this.num)
        };
        this.swapHandler(randomPos);
      }
      this.totalMoves = 0;
    },
    restart(){
      this.winCheck = false;
      this.shuffle()
    }
  },
  watch: {
    num() {
      this.grid = setGrid(this.num);
      this.shuffle();
    }
  },
  mounted() {
    this.grid = setGrid(this.num);
    this.shuffle();
  }
});
