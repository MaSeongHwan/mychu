"""
주피터 노트북에서 사용할 검색 위젯 모듈
이 모듈을 통해 쉽게 콘텐츠를 검색하고 결과를 출력할 수 있습니다.
"""

try:
    import ipywidgets as widgets
    from IPython.display import display, HTML
    import pandas as pd
    JUPYTER_AVAILABLE = True
except ImportError:
    JUPYTER_AVAILABLE = False
    print("이 모듈은 주피터 노트북 환경에서만 사용할 수 있습니다.")

from server.core.search_engine import main_search_assets, is_adult_search_assets, advanced_search_assets


def search_widget():
    """
    기본 검색 위젯 생성
    일반 콘텐츠만 검색 (성인 콘텐츠 제외)
    """
    if not JUPYTER_AVAILABLE:
        print("주피터 노트북 환경에서만 사용할 수 있습니다.")
        return

    # 검색 텍스트 입력 위젯
    text = widgets.Text(
        description='검색어:',
        placeholder='검색어를 입력하세요...',
        layout=widgets.Layout(width='500px')
    )
    
    # 결과 출력 영역
    output = widgets.Output()
    
    def on_submit(change):
        # 변경 이벤트가 값 변경인지 확인
        if change.name != 'value':
            return
            
        query = change.new
        if not query or len(query) < 2:
            return
            
        output.clear_output()
        with output:
            print(f"'{query}' 검색 결과:")
            results = main_search_assets(query=query)
            
            if not results:
                print("검색 결과가 없습니다.")
                return
                
            # 결과를 데이터프레임으로 변환하여 표시
            df = pd.DataFrame(results)
            display(df)
            
            # 포스터 이미지가 있으면 표시
            for result in results[:5]:  # 처음 5개만 표시
                if result.get('poster_path'):
                    display(HTML(f"<h4>{result['asset_nm']}</h4>"))
                    display(HTML(f"<img src='{result['poster_path']}' width='150'>"))
    
    # Enter 키 입력 이벤트 리스너 등록
    text.observe(on_submit, names='value')
    
    # 검색 버튼
    button = widgets.Button(description="검색")
    
    def on_button_click(b):
        on_submit(widgets.eventful.EventfulDict({
            'name': 'value',
            'new': text.value
        }))
    
    button.on_click(on_button_click)
    
    # 위젯 표시
    display(widgets.HBox([text, button]))
    display(output)
    
    return text, output


def advanced_search_widget():
    """
    고급 검색 위젯 생성
    다양한 필터링 옵션 제공
    """
    if not JUPYTER_AVAILABLE:
        print("주피터 노트북 환경에서만 사용할 수 있습니다.")
        return
        
    # 검색어 입력
    query_text = widgets.Text(
        description='검색어:',
        placeholder='검색어를 입력하세요...',
        layout=widgets.Layout(width='500px')
    )
    
    # 장르 입력
    genre_text = widgets.Text(
        description='장르:',
        placeholder='예: 액션, 코미디, 드라마',
        layout=widgets.Layout(width='500px')
    )
    
    # 출시 연도 선택
    year_slider = widgets.IntSlider(
        value=2020,
        min=1990,
        max=2025,
        step=1,
        description='출시년도:',
        disabled=False,
        continuous_update=False,
        orientation='horizontal',
        readout=True,
        readout_format='d',
        layout=widgets.Layout(width='500px')
    )
    
    # 성인 콘텐츠 포함 여부
    adult_checkbox = widgets.Checkbox(
        value=False,
        description='성인 콘텐츠 포함',
        disabled=False
    )
    
    # 영화/시리즈 선택
    media_type = widgets.RadioButtons(
        options=[('모두', None), ('영화만', True), ('시리즈만', False)],
        description='미디어 타입:',
        disabled=False
    )
    
    # 결과 출력 영역
    output = widgets.Output()
    
    # 검색 버튼
    search_button = widgets.Button(
        description='검색',
        button_style='primary',
        tooltip='클릭하여 검색',
        icon='search'
    )
    
    def on_search_click(b):
        output.clear_output()
        
        with output:
            query = query_text.value
            if not query or len(query) < 2:
                print("검색어를 2글자 이상 입력하세요.")
                return
                
            print(f"검색 중: '{query}'")
            
            results = advanced_search_assets(
                query=query,
                genre=genre_text.value if genre_text.value else None,
                release_year=year_slider.value,
                is_adult=adult_checkbox.value,
                is_movie=media_type.value
            )
            
            if not results:
                print("검색 결과가 없습니다.")
                return
                
            print(f"검색 결과: {len(results)}개 항목 발견")
            
            # 결과를 데이터프레임으로 변환하여 표시
            df = pd.DataFrame(results)
            display(df)
            
            # 포스터 이미지가 있으면 표시
            for result in results[:5]:  # 처음 5개만 표시
                if result.get('poster_path'):
                    display(HTML(f"<h4>{result['asset_nm']}</h4>"))
                    display(HTML(f"<img src='{result['poster_path']}' width='150'>"))
    
    search_button.on_click(on_search_click)
    
    # 위젯 구성 및 표시
    controls = widgets.VBox([
        query_text, 
        genre_text, 
        year_slider, 
        widgets.HBox([adult_checkbox, media_type]), 
        search_button
    ])
    
    display(controls)
    display(output)
    
    return controls, output


# 사용 예시
if __name__ == "__main__" and JUPYTER_AVAILABLE:
    print("검색 위젯 사용 예시:")
    print("1. 기본 검색: search_widget()")
    print("2. 고급 검색: advanced_search_widget()")
