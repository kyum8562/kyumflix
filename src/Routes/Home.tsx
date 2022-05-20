import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoivesResult } from '../api';
import { makeImagePath } from '../utils';
import { motion, AnimatePresence, useViewportScroll } from 'framer-motion';
import { useState } from 'react'
import { useNavigate, useMatch, PathMatch } from 'react-router-dom';


const Wrapper = styled.div`
    background-color: black;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Banner = styled.div<{bgPhoto: string}>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)) , url(${(props => props.bgPhoto)});
    background-size: cover;
`;

const Title = styled.h2`
    font-size: 55px;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    font-size: 25px;
    width: 50%;
`;

const Slider = styled.div`
    top: -100px;
    position: relative;
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;
`;

const Box = styled(motion.div)<{bgPhoto: string}>`
    background-color: #fff;
    height: 200px;
    background-image: url(${props => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
  }
`;

const rowVariants = {
    hidden: {
        x: window.innerWidth + 5,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.innerWidth - 5,
    }
};

const BoxVariants = {
    nomal: {
        scale: 1,
    },
    hover: {
        scale: 1.3,
        y: -80,
        trainsition: {
            delay: 0.5,
            duration: 0.1,
            type: "tween,"
        },
    },
    
};

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {
    text-align: center;
    font-size: 18px;
    }
`;

const InfoVariants = {
    hover: {
        opacity: 1,
        transition: {
          delay: 0.5,
          duaration: 0.1,
          type: "tween",
        },
      },
    };

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;
  
const BigMovie = styled(motion.div)`
    position: absolute;
    width: 40vw;
    height: 80vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${(props) => props.theme.black.lighter};
`;
const BigCover = styled.div`
width: 100%;
background-size: cover;
background-position: center center;
height: 400px;
`;

const BigTitle = styled.h3`
color: ${(props) => props.theme.white.lighter};
padding: 20px;
font-size: 46px;
position: relative;
top: -80px;
`;

const BigOverview = styled.p`
padding: 20px;
position: relative;
top: -80px;
color: ${(props) => props.theme.white.lighter};
`;

const offset = 6;

function Home(){
    // ueseQuery Hook : fetch를 사용해서 data와 isLoading(아직 로딩중인지)에 대한 알림을 전해줌
    // <IGetMoivesResult> : 가져온 데이터의 타입을 명시
    const {data, isLoading } = useQuery<IGetMoivesResult>(["movies, nowPlaying"], getMovies);
    // console.log(data, isLoading);
    // console.log(data?.results[0].backdrop_path);
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const increaseIndex = () => {
        if(data){
            if(leaving) return;
            toggleLeaving();
            const totalMovies = data?.results.length -1;
            const maxIndex = Math.floor(totalMovies / offset) -1;
            setIndex((prev) => prev=== maxIndex ? 0 : prev+1 );
        }
    };
    const toggleLeaving = () => setLeaving(prev => !prev);
    const navigate = useNavigate();
    const moviePathMatch: PathMatch< string> | null = useMatch("/movies/:id");
    const onBoxClicked = (id: number) => {
        navigate(`/movies/${id}`);
      };
    const { scrollY } = useViewportScroll();
    const onOverlayClick = () => navigate("/");
    const clickedMovie =
    moviePathMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === 1);
    return(
        <Wrapper>
            {isLoading ? 
            <Loader>Loading</Loader> :
            <>
                <Banner onClick={increaseIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                    <Title>{data?.results[0].title}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                </Banner>

                <Slider>
                    {/* onExitComplete: exit이 끝났을 때 실행 */}
                    <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                        <Row variants={rowVariants} 
                             initial="hidden" 
                             animate="visible"
                             exit="exit"
                             transition={{type:"tween", duration: 1}}
                             key={index}>
                          {data?.results.slice(1).slice(offset*index, offset*index + offset)
                          .map(movie => <Box 
                                            layoutId={movie.id + ""}
                                            key={movie.id}
                                            whileHover="hover"
                                            initial="nomal"
                                            variants={BoxVariants}
                                            transition={{type: "tween"}}
                                            onClick={() => onBoxClicked(movie.id)}
                                            bgPhoto={makeImagePath(movie.backdrop_path, "w500")} 
                                        >
                                            <Info variants={InfoVariants}>
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>    
                                        )}
                        </Row>
                    </AnimatePresence>
                </Slider>
                <AnimatePresence>
                    {moviePathMatch ? (
                    <>
                        <Overlay
                        onClick={onOverlayClick}
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        />
                        <BigMovie
                        style={{ top: scrollY.get() + 100 }}
                        layoutId={moviePathMatch.params.movieId}
                        >
                        {clickedMovie && (
                        <>
                            <BigCover
                                style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                    clickedMovie.backdrop_path,
                                    "w500"
                                )})`,
                                }}
                            />
                            <BigTitle>{clickedMovie.title}</BigTitle>
                            <BigOverview>{clickedMovie.overview}</BigOverview>
                            </>
                        )}
                            </BigMovie>
                        </>
                    ) : null}
                </AnimatePresence>
            </>}
        </Wrapper>
    );
}

export default Home;