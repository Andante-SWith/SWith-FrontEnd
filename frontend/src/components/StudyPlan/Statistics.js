import styled from 'styled-components';

import React, { useEffect, useState } from 'react';
import { getUserStatistics } from '../../api/APIs';
import Chart from 'react-apexcharts';
import moment from 'moment';
import Timer from './Timer';
import Progress from './Progress';

const Statistics = ({ task }) => {
  //현재 날짜
  const Today = moment(moment().format('YYYY-MM-DD'));
  //해당 달의 마지막일
  const MonthsEndday = moment(moment().endOf('month').format('YYYY-MM-DD'));

  //원하는 날짜의 주차 구하기
  const weekOfMonth = (m) => m.week() - moment(m).startOf('month').week() + 1;

  // 공부시간 기록
  const [todaytime, setTodaytime] = useState({
    hour: 0,
    minute: 0,
    second: 0,
    count: 0,
  });

  const [weektime, setWeektime] = useState({
    hour: 0,
    minute: 0,
    second: 0,
    count: 0,
  });

  const [monthtime, setMonthtime] = useState({
    hour: 0,
    minute: 0,
    second: 0,
    count: 0,
  });

  // 달성률 기록

  //오늘의 달성률
  const [todaycomp, setTodaycomp] = useState(0);
  const [tcCount, setTcCount] = useState(0);

  //주간 달성률: 요일 - 0: 일, 1: 월, 2: 화. 3: 수, 4: 목, 5: 금, 6: 토
  let weekarray = [];
  for (let i = 0; i < 7; i++) {
    weekarray.push({
      id: i,
      comp: 0,
      count: 0,
    });
  }
  const [weekcompRate, setWeekcompRate] = useState(weekarray);

  const [weekcomp, setWeekcomp] = useState(0);
  const [wcCount, setWcCount] = useState(0);

  //월간 달성률(1주차 ~ endDay's week 표현)
  const countweek = weekOfMonth(MonthsEndday);
  let montharray = [];
  for (let i = 1; i <= countweek; i++) {
    montharray.push({
      id: i,
      comp: 0,
      count: 0,
    });
  }
  const [monthcompRate, setMonthcompRate] = useState(montharray);

  const [monthcomp, setMonthcomp] = useState(0);
  const [mcCount, setMcCount] = useState(0);

  useEffect(() => {
    const userInfo = JSON.parse(window.sessionStorage.userInfo);
    //console.log(weekcompRate);

    //공부시간
    getUserStatistics(userInfo.userId)
      .then((response) => {
        const datas = response.data.data;
        //console.log(datas);
        datas.map((data) => {
          //일간, 주간, 월간 공부시간 기록
          const D_date = moment(data.date);
          //console.log(D_date);
          const Diff = Math.abs(Today.diff(D_date, 'days'));

          const hour = Number(data.studyTime.slice(0, 2));
          const minute = Number(data.studyTime.slice(3, 5));
          const second = Number(data.studyTime.slice(6, 8));

          if (Today.month() + 1 === D_date.month() + 1) {
            if (Today.week() === D_date.week()) {
              //오늘의 공부시간
              if (Diff === 0) {
                setTodaytime((prevmonth) => ({
                  ...prevmonth,
                  hour: prevmonth.hour + hour,
                  minute: prevmonth.minute + minute,
                  second: prevmonth.second + second,
                  count: prevmonth.count + 1,
                }));
              }
              //주간 공부시간
              setWeektime((prevmonth) => ({
                ...prevmonth,
                hour: prevmonth.hour + hour,
                minute: prevmonth.minute + minute,
                second: prevmonth.second + second,
                count: prevmonth.count + 1,
              }));
            }
            //월간 공부시간
            setMonthtime((prevmonth) => ({
              ...prevmonth,
              hour: prevmonth.hour + hour,
              minute: prevmonth.minute + minute,
              second: prevmonth.second + second,
              count: prevmonth.count + 1,
            }));
          }
        });
      })
      .catch((error) => {
        console.log(error.toJSON());
      });
    //달성률
    task.map((event) => {
      const D_event = moment(event.start);
      //console.log(event);

      if (Today.month() + 1 === D_event.month() + 1) {
        //월간 달성률
        setMonthcompRate((month) =>
          month.map((week) =>
            week.id === weekOfMonth(D_event)
              ? {
                  ...week,
                  comp: week.comp + event.complete,
                  count: week.count + 1,
                }
              : week,
          ),
        );
        //console.log(weekOfMonth(D_event) + "주차: " + event);
        setMonthcomp((monthcomp) => monthcomp + event.complete);
        setMcCount((mcCount) => mcCount + 1);

        if (Today.week() === D_event.week()) {
          //주간 달성률
          //console.log(D_event.day());
          const id = D_event.day();
          setWeekcompRate((week) =>
            week.map((day) =>
              day.id === id
                ? {
                    ...day,
                    comp: day.comp + event.complete,
                    count: day.count + 1,
                  }
                : day,
            ),
          );

          setWeekcomp((weekcomp) => weekcomp + event.complete);
          setWcCount((wcCount) => wcCount + 1);

          if (Today.day() === D_event.day()) {
            //오늘의 달성률
            setTodaycomp((todaycomp) => todaycomp + event.complete);
            setTcCount((tcCount) => tcCount + 1);
          }
        }
      }
    });
  }, []);

  return (
    <Container>
      <StatsPage>
        <PartPage>
          <h1 style={{ display: 'flex' }}>일간</h1>
          <BoxPage>
            <Box style={{ width: '200px' }}>
              <div>
                <Label>오늘의 공부시간</Label>
                <Timer
                  hours={todaytime.hour}
                  minutes={todaytime.minute}
                  seconds={todaytime.second}
                  count={todaytime.count}
                />
              </div>
            </Box>
            <Box>
              <div>
                <Label>오늘의 달성률</Label>
                <ProgressWrap>
                  <Progress
                    style={{ width: '300px' }}
                    done={
                      tcCount === 0 ? 0 : Math.round(Number(todaycomp / tcCount) * 100)
                    }
                  />
                </ProgressWrap>
              </div>
            </Box>
          </BoxPage>
        </PartPage>
        <PartPage>
          <h1 style={{ display: 'flex' }}>주간</h1>
          <BoxPage>
            <Box style={{ width: '200px' }}>
              <div>
                <Label>주간 평균 공부시간</Label>
                <Timer
                  hours={weektime.hour}
                  minutes={weektime.minute}
                  seconds={weektime.second}
                  count={weektime.count}
                />
              </div>
            </Box>
            <Box style={{ width: '200px' }}>
              <div>
                <Label>주간 총 공부시간</Label>
                <Timer
                  hours={weektime.hour}
                  minutes={weektime.minute}
                  seconds={weektime.second}
                  count="1"
                />
              </div>
            </Box>
            <Box>
              <div>
                <Label>주간 달성률</Label>
                <Chart
                  options={{
                    fill: {
                      colors: '#ef8585',
                    },
                    chart: {
                      type: 'bar',
                      toolbar: {
                        show: false,
                      },
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 4,
                        dataLabels: {
                          position: 'top', // top, center, bottom
                        },
                      },
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val) {
                        return val + '%';
                      },
                      offsetY: -20,
                      style: {
                        fontSize: '12px',
                        colors: ['#304758'],
                      },
                    },
                    xaxis: {
                      categories: [
                        '일요일',
                        '월요일',
                        '화요일',
                        '수요일',
                        '목요일',
                        '금요일',
                        '토요일',
                        '일요일',
                      ],
                    },
                  }}
                  series={[
                    {
                      name: 'Week Complete',
                      data: weekcompRate.map((data) => {
                        return data.count === 0
                          ? 0
                          : Math.round((data.comp / data.count) * 100);
                      }),
                    },
                  ]}
                  type="bar"
                  height={200}
                />
                {/* {weekcompRate.map((day) => {
                  return (
                    <div>
                      <p>{`${day.id}요일`}</p>
                      {day.count === 0
                        ? 0
                        : Math.round((day.comp / day.count) * 100)}
                    </div>
                  );
                })} */}
              </div>
            </Box>
            <Box>
              <div>
                <Label>주간 평균 달성률</Label>
                <ProgressWrap>
                  <Progress
                    done={
                      wcCount === 0 ? 0 : Math.round(Number(weekcomp / wcCount) * 100)
                    }
                  />
                </ProgressWrap>
              </div>
            </Box>
          </BoxPage>
        </PartPage>
        <PartPage>
          <h1 style={{ display: 'flex' }}>월간</h1>
          <BoxPage>
            <Box style={{ width: '200px' }}>
              <div>
                <Label>월간 평균 공부시간</Label>
                <Timer
                  hours={monthtime.hour}
                  minutes={monthtime.minute}
                  seconds={monthtime.second}
                  count={monthtime.count}
                />
              </div>
            </Box>
            <Box style={{ width: '200px' }}>
              <div>
                <Label>월간 총 공부시간</Label>
                <Timer
                  hours={monthtime.hour}
                  minutes={monthtime.minute}
                  seconds={monthtime.second}
                  count="1"
                />
              </div>
            </Box>
            <Box>
              <div>
                <Label>월간 달성률</Label>
                <Chart
                  options={{
                    fill: {
                      colors: '#ef8585',
                    },
                    chart: {
                      type: 'bar',
                      toolbar: {
                        show: false,
                      },
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 4,
                        dataLabels: {
                          position: 'top', // top, center, bottom
                        },
                      },
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val) {
                        return val + '%';
                      },
                      offsetY: -20,
                      style: {
                        fontSize: '12px',
                        colors: ['#304758'],
                      },
                    },
                    xaxis: {
                      categories: monthcompRate.map((data) => {
                        return `${data.id}주차`;
                      }),
                    },
                  }}
                  series={[
                    {
                      name: 'Month Complete',
                      data: monthcompRate.map((data) => {
                        return data.count === 0
                          ? 0
                          : Math.round((data.comp / data.count) * 100);
                      }),
                    },
                  ]}
                  type="bar"
                  height={200}
                />
              </div>
            </Box>
            <Box>
              <div>
                <Label>월간 평균 달성률</Label>
                <ProgressWrap>
                  <Progress
                    done={
                      mcCount === 0 ? 0 : Math.round(Number(monthcomp / mcCount) * 100)
                    }
                  />
                </ProgressWrap>
              </div>
            </Box>
          </BoxPage>
        </PartPage>
      </StatsPage>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  margin-top: 20px;
`;
const StatsPage = styled.div`
  display: flex;
  position: relative;
  width: 1224px;
  margin: 0 auto;
  padding: 25px 61px 50px;
  border-radius: 13px;
  background-color: #ededed;
  text-align: left;
  flex-direction: column;
`;

const PartPage = styled.div`
  text-align: left;
`;

const BoxPage = styled.div`
  display: flex;
  flex-direction: row;
`;

const Box = styled.div`
  display: inline-block;
  margin: 20px;
  padding: 40px 20px;
  height: 200px;
  border-radius: 13px;
  background-color: #fafafa;
  align-items: center;
  flex-direction: column;
`;

const Label = styled.label`
  font-family: Roboto;
  font-size: 17px;
  font-weight: bold;
  text-align: left;
  width: 100%;
  color: #595959;
`;

const ProgressWrap = styled.div`
  margin-top: 60px;
  width: 300px;
`;

export default Statistics;