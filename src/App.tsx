import { useState, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Select,
  Row,
  Col,
  DatePicker,
} from "antd";

interface IData {
  sno: number;
  code: string;
  name: string;
  type: string;
  availability: boolean;
  needing_repair: boolean;
  durability: number;
  max_durability: number;
  mileage: number;
  price: number;
  minimum_rent_period: number;
}

type EffectCallback = () => void | Destructor;

declare const UNDEFINED_VOID_ONLY: unique symbol;

type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };

const columns = [
  {
    title: "S. No",
    dataIndex: "sno",
    key: "sno",
    sorter: (a: IData, b: IData) => a.sno - b.sno,
    ellipsis: true,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a: IData, b: IData) => a.name.length - b.name.length,
    ellipsis: true,
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
    sorter: (a: IData, b: IData) => a.code.length - b.code.length,
    ellipsis: true,
  },
  {
    title: "Availability",
    dataIndex: "availability",
    key: "availability",
    render: (avail: boolean) => <>{avail ? "True" : "False"}</>,
    ellipsis: true,
  },
  {
    title: "Need to repair",
    dataIndex: "need_to_repair",
    key: "need_to_repair",
    render: (repair: boolean) => <>{repair ? "True" : "False"}</>,
    ellipsis: true,
  },
  {
    title: "Durability",
    dataIndex: "durability",
    key: "durability",
    sorter: (a: IData, b: IData) => a.durability - b.durability,
    ellipsis: true,
  },
  {
    title: "Mileage",
    dataIndex: "mileage",
    key: "mileage",
    sorter: (a: IData, b: IData) => a.mileage - b.mileage,
    ellipsis: true,
  },
];

const FinalModal = () => {
  return <Modal></Modal>;
};

const App = (props: any): JSX.Element => {
  const [data, setData] = useState<IData[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentStep,setCurrentStep] = useState<number>(0);
  const [estimatedPrice,setEstimatedPrice] = useState<number>(0);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch("/data.json");
      const data = await response.json();
      console.log(data);
      setData(data.map((d: IData, i: number) => ({ ...d, sno: i + 1 })));
    };
    getData();
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
  };

  const onBookProduct = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setShowModal(true);
  };

  const onProductReturn = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {

  };

  const bookProductSteps = [
    <>
      <Row justify="center">
        <Col md={12}>
          <Select style={{ width: "250px" }}>
            {data.map((d) => (
              <Select.Option key={d.name + d.code} value={d.name + d.code}>
                {d.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row style={{ marginTop: "2rem" }}>
        <Col md={12}>
          From:
          <DatePicker style={{ marginLeft: "1rem" }} />
        </Col>
        <Col md={12}>
          To:
          <DatePicker style={{ marginLeft: "1rem" }} />
        </Col>
      </Row>
      <Row justify="end" style={{ marginTop: "2rem" }}>
        <Button type="primary" onClick={() => setShowModal(false)}>
          No
        </Button>
        <Button type="primary" onClick={() => setCurrentStep(1)} style={{ marginLeft: "1rem" }}>
          Yes
        </Button>
      </Row>
    </>,
    <>
      <Row>
        <Col md={24}>
          Your estimated price is {estimatedPrice} <br/>
          Do you want to proceed?
        </Col>
      </Row>
      <Row justify="end" style={{ marginTop: "2rem" }}>
        <Button type="primary" onClick={() => setShowModal(false)}>
          No
        </Button>
        <Button type="primary" onClick={() => setShowModal(false)} style={{ marginLeft: "1rem" }}>
          Yes
        </Button>
      </Row>
    </>
  ];

  return (
    <div>
      <div>
        <Input
          style={{ width: "10rem", float: "right" }}
          placeholder="Search"
          type="text"
          onChange={onInputChange}
        />
      </div>
      <Table
        columns={columns}
        dataSource={data.filter((i) =>
          i.name.toLowerCase().includes(searchKey)
        )}
      />
      <div className="cta-wrapper">
        <Button type="primary" onClick={onBookProduct}>
          Book
        </Button>
        <Button type="primary" onClick={onProductReturn}>
          Return
        </Button>
      </div>
      <Modal onCancel={() => setShowModal(false)} title="Book a product" visible={showModal}>
        {
          bookProductSteps[currentStep]
        }
      </Modal>
    </div>
  );
};

export default App;
