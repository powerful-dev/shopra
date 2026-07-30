import PageContainer from '../components/admin/PageContainer';

export default function PlaceholderPage({ title, description }) {
    return <PageContainer><section className="shopra-placeholder uk-card uk-card-default"><p>Скоро в Shopra</p><h1>{title}</h1><span>{description}</span></section></PageContainer>;
}
