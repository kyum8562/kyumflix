const API_KEY = "08eae69feffb85e384809388866cf0a2";
const BASE_PATH = 'https://api.themoviedb.org/3/';
// https://api.themoviedb.org/3/movie/now_playing?api_key=08eae69feffb85e384809388866cf0a2&language=en-US&page=1
// https://image.tmdb.org/t/p/original/


// typescript 사용하기 위해서는 API 응답의 타입을 지정해 주어야 함 => 인터페이스를 지정 => 자동완성 사용가능
// 영화 데이터 내의 results 배열에 대한 I(interface)
// 필요한 부분만 적는다
export interface IMoive{
  id: number;            // id
  backdrop_path: string; // 배경 포스터
  poster_path: string;   // 포스터
  title: string;         // 제목
  overview: string;      // 요약 줄거리
}

// 영화 데이터 결과에 대한 I(interface)
export interface IGetMoivesResult {
  dates: {
    maximum: string;
    minimum: string; 
  };
  page: number;
  results: IMoive[];
  total_pages: number;
  total_results: number;
}

export function getMovies(){
  // fetch : 데이터를 받아오고 JSON을 리턴하는 역할(함수)
  return fetch(`${BASE_PATH}movie/now_playing?api_key=${API_KEY}`).then(res => res.json());
}