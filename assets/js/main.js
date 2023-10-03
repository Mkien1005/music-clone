const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $(".cd");
const head = $("header h2");
const thumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const app = {
  currentIndex: 0,
  isPlaying: false,
  random: false,
  _repeat: false,
  song: [
    {
      name: "Unholy",
      singer: "Kim Petras",
      path: "./assets/music/Unholy ft Kim Petras.mp3",
      image: "./assets/img/1.jpg",
    },
    {
      name: "Ái Thương",
      singer: "Tiểu Thời",
      path: "./assets/music/Ái Thương 爱殇  Tiểu Thời 小时姑娘 ft Gong Tuấn Gong駿  Đông Cung 东宫 OST.mp3",
      image: "./assets/img/2.jpg",
    },
    {
      name: "Một bước yêu vạn dặm đau",
      singer: "Mr. Siro",
      path: "./assets/music/Một Bước Yêu Vạn Dặm Đau Lyrics Video  Mr Siro.mp3",
      image: "./assets/img/3.jpg",
    },
    {
      name: "Cuối cùng thì",
      singer: "Tama",
      path: "./assets/music/CUỐI CÙNG THÌ TAMA COVER.mp3",
      image: "./assets/img/4.jpg",
    },
    {
      name: "Trap Queen",
      singer: "Remix",
      path: "./assets/music/TRAP QUEEN ft LÝ DO LÀ GÌ REMIX TIKTOK  EM BUÔNG TAY ANH VÌ LÝ DO GÌ REMIX  NONSTOP 2023 VINAHOUSE.mp3",
      image: "./assets/img/5.jpg",
    },
    {
      name: "Thêm bao nhiêu lâu",
      singer: "Đạt G",
      path: "./assets/music/Thêm Bao Nhiêu Lâu  Đạt G  OFFICIAL MV.mp3",
      image: "./assets/img/6.png",
    },
  ],
  render: function () {
    const htmls = this.song.map((song, index) => {
      return `<div class="song ${index} ${
        index === this.currentIndex ? "active" : ""
      }">
        <div
          class="thumb"
          style="
            background-image: url(${song.image});
          "
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>`;
    });
    var playlist = $(".playlist");
    playlist.innerHTML = htmls.join("");
    this.choseSong();
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.song[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    let _this = this; //gán _this = app; vì khi vào function con của function này,
    //gọi this sẽ ra đến function con đó(thằng cha), trong khi this muốn là thằng ông
    let cdWidth = cd.offsetWidth;
    //bắt sự kiện lăn chuột, phóng to thu nhỏ CD
    document.addEventListener("scroll", (e) => {
      let scroll = window.scrollY || document.documentElement.scrollTop;
      let newCdWidth = cdWidth - scroll;
      if (newCdWidth > 0) {
        cd.style.width = newCdWidth + "px";
      } else cd.style.width = 0;
    });
    //nghe sự kiện bấm vào nút play
    playBtn.addEventListener("click", () => {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    });
    //Xử lý cd quay /dừng
    const cdthumbAnimate = cd.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, //quay trong khoảng thời lượng bài hát
      iterations: Infinity, //Lặp lại ~ LOOP
    });
    cdthumbAnimate.pause();
    //khi song được play
    audio.addEventListener("play", () => {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdthumbAnimate.play();
    });
    //khi song pause
    audio.addEventListener("pause", () => {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdthumbAnimate.pause();
    });
    //Khi tiến độ bài hát thay đổi
    audio.addEventListener("timeupdate", () => {
      //currentTime là thời gian hiện tại bài hát chạy được, trả về số giây
      // duration trả về thời lượng của bài hát.(dài bao nhiêu giây)
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    });
    //Xử lý khi tua song
    progress.onchange = function (e) {
      audio.currentTime = (e.target.value / 100) * audio.duration;
    };
    //nhấn nút tiến đến bài tiếp theo
    nextBtn.addEventListener("click", () => {
      if (_this.random) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
    });
    //nhấn nút về bài trước đó
    prevBtn.addEventListener("click", () => {
      if (_this.random) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
    });
    //xử lý nút phát ngẫu nhiên bài hát
    randomBtn.onclick = function () {
      _this.random = !_this.random;
      this.classList.toggle("active", _this.random);
    };
    //xử lý nut phát lại bài hát
    repeatBtn.onclick = function () {
      _this._repeat = !_this._repeat;
      this.classList.toggle("active", _this._repeat);
    };
    //xử lý khi bài hát kết thúc thì chuyển đến bài tiếp theo
    audio.addEventListener("ended", () => {
      if (_this._repeat) {
        audio.play();
      } else {
        if (_this.random) {
          _this.playRandomSong();
        } else {
          _this.nextSong();
        }
        audio.play();
      }
    });
  },
  loadcurrentSong() {
    head.textContent = this.currentSong.name;
    thumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
    this.render();
    this.scrollToActiveSong();
  },
  nextSong() {
    this.currentIndex++;
    if (this.currentIndex >= this.song.length) {
      this.currentIndex = 0;
    }
    this.loadcurrentSong();
  },
  prevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.song.length - 1;
    }
    this.loadcurrentSong();
  },
  playRandomSong: function () {
    let oldIndex = this.currentIndex;
    do {
      this.currentIndex = Math.floor(Math.random() * this.song.length);
    } while (oldIndex === this.currentIndex);
    this.loadcurrentSong();
  },
  scrollToActiveSong: function () {
    let activeSong = $(".song.active");
    setTimeout(() => {
      activeSong.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 500);
  },
  choseSong: function () {
    var songItems = $$(".song");
    songItems.forEach((songItem, index) => {
      songItem.onclick = function () {
        app.currentIndex = index;
        // app.currentIndex = this.currentIndex;
        app.loadcurrentSong();
        audio.play();
      };
    });
  },
  start: function () {
    //Định nghĩa các thuộc tính cho object
    this.defineProperties();
    //Xử lý sự kiện lăn chuột xuống, bài hát đang phát sẽ bé lại
    this.handleEvent();
    //Phát bài hát đầu tiên khi load trang
    this.loadcurrentSong();
    //Hiển thị danh sách bài hát trong list
    this.render();
  },
};
app.start();
