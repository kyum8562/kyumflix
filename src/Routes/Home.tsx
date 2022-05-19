import { useQuery } from "react-query";
import styled from "styled-components";
import { getMovies, IGetMoivesResult } from '../api';
import { makeImagePath } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react'


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
                                            key={movie.id}
                                            bgPhoto={makeImagePath(movie.backdrop_path, "w500")} 
                                        />)}
                        </Row>
                    </AnimatePresence>
                </Slider>
            </>}
        </Wrapper>
    );
}

export default Home;