import axios from 'axios';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { Button, Spinner, Table } from 'react-bootstrap';
import Pagination from 'react-js-pagination';

const MySellList = ({ location, history }) => {
    const [sellList, setSellList] = useState(['aaa']);
    const [total, setTotal] = useState(1);
    const [loading, setLoading] = useState(false);
    const search = qs.parse(location.search, { ignoreQueryPrefix: true });
    const page = parseInt(search.page) || 1;
    const seller = search.seller;

    const callSellList = async () => {
        setLoading(true);
        const result = await axios.get(`/api/tradeinfo/selllist?seller=${seller}&page=${page}`)
        setSellList(result.data.list);
        setTotal(result.data.total);
        setLoading(false);
    }

    useEffect(() => {
        callSellList();
    }, [page])

    if (loading) return (
        <Spinner animation="border" variant="primary"
            style={{ width: '20rem', height: '20rem', marginTop: '220px' }} />
    )


    return (
        <div>
            <button style={{marginTop:30, float:'left'}} onClick={()=>history.push('/my/sellchart')}>판매내역 차트로 확인</button>
            <Table striped className='mt-5'>
                <thead>
                    <tr >
                        <th>판매가격</th>
                        <th>판매일자</th>
                        <th>후기쓰기</th>
                    </tr>
                </thead>
                <tbody>
                    {sellList.map(list =>
                        <>
                            <tr key={list.paycode}>
                                <td>{list.payprice}</td>
                                <td>{list.regDate}</td>
                                {(list.sellercondition === 0) ?
                                    /* buyer=seller, seller=buyer로 거꾸로 바꿔주기만 하면 seller가 buyer에 관한 리뷰를 쓸 수 있음. */
                                    <td><Button onClick={() => history.push(`/my/review/insert/${list.paycode}?buyer=${list.seller}&seller=${list.buyer}&pcode=${list.pcode}`)}>
                                        후기쓰러가기</Button></td>
                                    :
                                    <td>후기 작성 완료</td>}
                            </tr>
                        </>
                    )}
                </tbody>
            </Table>

            {sellList.length !== 0 ?     <div style={{ marginLeft:720 }}>
                <Pagination
                    activePage={page}
                    itemsCountPerPage={6}
                    totalItemsCount={total}
                    pageRangeDisplayed={10}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={(e) => history.push(`/pboard/list?page=${e}`)}
                /> </div> : <div style={{ marginTop: 200 }}>
                <h1 style={{ fontSize: 60, color: 'red',marginBottom:200 }}>해당 검색 결과가 존재하지 않습니다.</h1>
            </div>}
        </div>


    )
}

export default MySellList