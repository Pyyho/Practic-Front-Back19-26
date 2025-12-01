import './TechnologyCardWrapper.css';

function TechnologyCardWrapper({ children, status }) {
    return (
        <div className={`card-wrapper ${status}`}>
            {children}
        </div>
    );
}

export default TechnologyCardWrapper;